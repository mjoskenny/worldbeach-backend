<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use App\Models\Event;
use App\Models\EventTicketOrder;
use App\Models\HostEventRequest;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $today = now()->startOfDay();
        $weekAgo = now()->copy()->subDays(6)->startOfDay();

        $orders = Order::query();
        $reservations = Reservation::query();
        $ticketOrders = EventTicketOrder::query();

        $paidOrderRevenue = (float) Order::whereIn('order_status', ['confirmed', 'ready', 'completed'])
            ->sum('total_amount');
        $ticketRevenue = (float) EventTicketOrder::whereIn('status', ['confirmed', 'paid', 'completed'])
            ->sum('total_amount');

        $recentOrders = Order::latest('ordered_at')
            ->take(5)
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->order_id,
                'customer_name' => $order->customer_name,
                'total_amount' => (float) $order->total_amount,
                'status' => $order->order_status,
                'ordered_at' => optional($order->ordered_at)->toIso8601String(),
                'items_count' => count($order->items ?? []),
            ]);

        $salesTrend = collect(range(0, 6))->map(function (int $offset) use ($weekAgo) {
            $date = $weekAgo->copy()->addDays($offset);

            $foodRevenue = (float) Order::whereDate('ordered_at', $date)
                ->whereIn('order_status', ['confirmed', 'ready', 'completed'])
                ->sum('total_amount');

            $ticketRevenue = (float) EventTicketOrder::whereDate('ordered_at', $date)
                ->whereIn('status', ['confirmed', 'paid', 'completed'])
                ->sum('total_amount');

            return [
                'date' => $date->toDateString(),
                'label' => $date->format('D'),
                'revenue' => $foodRevenue + $ticketRevenue,
                'orders' => Order::whereDate('ordered_at', $date)->count(),
                'tickets' => EventTicketOrder::whereDate('ordered_at', $date)->sum('quantity'),
            ];
        })->values();

        return response()->json([
            'stats' => [
                'total_revenue' => $paidOrderRevenue + $ticketRevenue,
                'today_revenue' => (float) Order::whereDate('ordered_at', $today)
                    ->whereIn('order_status', ['confirmed', 'ready', 'completed'])
                    ->sum('total_amount') +
                    (float) EventTicketOrder::whereDate('ordered_at', $today)
                        ->whereIn('status', ['confirmed', 'paid', 'completed'])
                        ->sum('total_amount'),
                'pending_orders' => (clone $orders)->where('order_status', 'pending')->count(),
                'confirmed_reservations' => (clone $reservations)->where('status', 'confirmed')->count(),
                'upcoming_events' => Event::where('status', 'upcoming')->count(),
                'tickets_sold' => (int) EventTicketOrder::sum('quantity'),
                'host_requests_pending' => HostEventRequest::where('status', 'pending')->count(),
                'users_total' => User::count(),
                'unread_notifications' => AdminNotification::whereNull('read_at')->count(),
            ],
            'quick_stats' => [
                'menu_orders_total' => Order::count(),
                'reservations_total' => Reservation::count(),
                'event_orders_total' => EventTicketOrder::count(),
                'cancelled_orders_total' => Order::where('order_status', 'cancelled')->count(),
            ],
            'status_breakdown' => [
                'orders' => [
                    'pending' => Order::where('order_status', 'pending')->count(),
                    'confirmed' => Order::where('order_status', 'confirmed')->count(),
                    'completed' => Order::where('order_status', 'completed')->count(),
                    'cancelled' => Order::where('order_status', 'cancelled')->count(),
                ],
                'reservations' => [
                    'pending' => Reservation::where('status', 'pending')->count(),
                    'confirmed' => Reservation::where('status', 'confirmed')->count(),
                    'cancelled' => Reservation::where('status', 'cancelled')->count(),
                ],
            ],
            'sales_trend' => $salesTrend,
            'recent_orders' => $recentOrders,
            'recent_notifications' => AdminNotification::latest()->take(6)->get()->map(
                fn (AdminNotification $notification) => [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'priority' => $notification->priority,
                    'read' => $notification->read_at !== null,
                    'timestamp' => optional($notification->created_at)->toIso8601String(),
                ]
            ),
        ]);
    }
}
