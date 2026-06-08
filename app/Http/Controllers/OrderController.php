<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Http;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email',
            'order_type' => 'required|in:dine-in,takeaway,delivery',
            'delivery_address' => 'nullable|string',
            'special_notes' => 'nullable|string',
            'items' => 'required|array',
            'total_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
            'ussd_code' => 'nullable|string',
        ]);

        // Get table info from session (set by QR code scan)
        $tableNumber = Session::get('table_number');
        $tableId = Session::get('table_id');

        // Only use table info if it exists in session (QR code was scanned)
        $orderData = [
            'order_id' => 'WB' . now()->format('ymdHis') . rand(100, 999),
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_email' => $request->customer_email,
            'order_type' => $request->order_type,
            'delivery_address' => $request->delivery_address,
            'special_notes' => $request->special_notes,
            'items' => $request->items,
            'total_amount' => $request->total_amount,
            'payment_method' => $request->payment_method,
            'ussd_code' => $request->ussd_code,
            'ordered_at' => now(),
        ];

        // Only add table info if it exists in session
        if ($tableNumber && $tableId) {
            $orderData['table_number'] = $tableNumber;
            $orderData['table_id'] = $tableId;
        }

        $order = Order::create($orderData);

        // Send WhatsApp message with order details
        $itemsText = '';
        foreach ($order->items as $item) {
            $itemsText .= $item['name'] . ' x' . $item['quantity'] . ' - ' . $item['price'] . "\n";
        }
        $message = "New Order: {$order->order_id}\nCustomer: {$order->customer_name}\nPhone: {$order->customer_phone}\nType: {$order->order_type}\nItems:\n{$itemsText}Total: {$order->total_amount}\nPayment: {$order->payment_method}";
        if ($order->special_notes) {
            $message .= "\nNotes: {$order->special_notes}";
        }
        if ($order->delivery_address) {
            $message .= "\nAddress: {$order->delivery_address}";
        }

        try {
            Http::post('https://graph.facebook.com/v17.0/' . env('WHATSAPP_PHONE_NUMBER_ID') . '/messages', [
                'headers' => [
                    'Authorization' => 'Bearer ' . env('WHATSAPP_ACCESS_TOKEN'),
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'messaging_product' => 'whatsapp',
                    'to' => '250795874742',
                    'type' => 'text',
                    'text' => ['body' => $message],
                ],
            ]);
        } catch (\Exception $e) {
            // Log error if sending fails, but don't fail the order
            \Log::error('Failed to send WhatsApp message: ' . $e->getMessage());
        }

        // Clear table session after order is placed
        Session::forget(['table_number', 'table_id']);

        return response()->json([
            'success' => true,
            'order' => $order,
            'message' => 'Order placed successfully!'
        ], 201);
    }

    public function getTableInfo(Request $request)
    {
        return response()->json([
            'table_number' => Session::get('table_number'),
            'table_id' => Session::get('table_id'),
        ]);
    }

    public function setTableInfo(Request $request)
    {
        $request->validate([
            'table_number' => 'required|string',
            'table_id' => 'required|string',
        ]);

        Session::put('table_number', $request->table_number);
        Session::put('table_id', $request->table_id);

        return response()->json([
            'success' => true,
            'message' => 'Table information stored successfully'
        ]);
    }

    public function index()
    {
        $orders = Order::latest()->paginate(20);
        return response()->json($orders);
    }

    public function show(Order $order)
    {
        return response()->json($order);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'order_status' => 'required|in:pending,confirmed,preparing,ready,completed,cancelled'
        ]);

        $order->update(['order_status' => $request->order_status]);

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }
}
