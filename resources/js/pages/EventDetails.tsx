import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Ticket, ArrowLeft, Minus, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { apiGet } from "../lib/api";
import { Event as EventType, EventVariant } from "../types/events";

interface TicketVariant {
  id: string;
  name: string;
  price: number;
  availability: number;
  benefits: string[];
}

export const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventType | null>(null);
  const [ticketVariants, setTicketVariants] = useState<TicketVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<TicketVariant | null>(null);

  // Fetch event from API
  useEffect(() => {
    if (!eventId) {
      toast.error("Invalid event ID");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const data = await apiGet<EventType>(`/events/${eventId}`);
        setEvent(data);

        const variants: TicketVariant[] = (data.variants || []).map((v: EventVariant) => ({
          id: String(v.id),
          name: v.name,
          price: v.price,
          availability: (v.capacity || 0) - (v.tickets_sold || 0),
          benefits: v.benefits || [],
        }));

        setTicketVariants(variants);
        if (variants.length > 0) setSelectedVariant(variants[0]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load event");
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl mb-4">Event Not Found</h2>
          <Link to="/events" className="text-[#00B4D8] hover:underline">
            Return to Events
          </Link>
        </div>
      </div>
    );
  }

  const totalCapacity =
    event?.variants?.reduce((sum, v) => sum + (v.capacity || 0), 0) || 0;

  const totalSold =
    event?.variants?.reduce((sum, v) => sum + (v.tickets_sold || 0), 0) || 0;

  const remaining = totalCapacity - totalSold;

// ✅ MISSING VARIABLE (THIS CAUSED BLANK PAGE)
  const selectedAvailability = selectedVariant?.availability ?? remaining;
  const maxQuantity = Math.max(0, Math.min(selectedAvailability, 10));



  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) setQuantity(newQuantity);
  };

  const handleBuyTickets = () => {
    if (!selectedVariant || selectedAvailability <= 0) {
      toast.error("Sorry, this ticket is sold out!");
      return;
    }

    const ticketPurchase = {
      event,
      variant: selectedVariant,
      quantity,
      total: selectedVariant.price * quantity,
    };

    sessionStorage.setItem("eventTicketPurchase", JSON.stringify(ticketPurchase));
    navigate("/event-checkout");
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-[#00B4D8] hover:text-[#0077B6] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </Link>
      </div>

      {/* Event Details */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <ImageWithFallback
                src={event.image ? `/storage/${event.image}` : "/placeholder.png"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {event.featured && (
                <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-[#FF6B35] text-white">
                  Featured Event
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col"
            >
              {/* Title & Description */}
              <div className="mb-6">
                <span className="inline-block px-4 py-1 rounded-full bg-[#00B4D8]/10 text-[#00B4D8] text-sm mb-4">
  {event.category?.name || "Uncategorized"}
</span>



                <h1 className="text-4xl md:text-5xl mb-4">{event.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">{event.description}</p>
              </div>

              {/* Event Info */}
              <div className="space-y-4 mb-8 p-6 rounded-2xl bg-gray-50 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00B4D8]/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#00B4D8]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                    <p className="text-foreground">
                      {event.date
                        ? new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "TBD"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00B4D8]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#00B4D8]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                    <p className="text-foreground">{event.time || "TBD"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00B4D8]/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#00B4D8]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="text-foreground">{event.location || "TBD"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00B4D8]/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#00B4D8]" />
                  </div>
                  <div>
  <p className="text-sm text-gray-600 dark:text-gray-400">Availability</p>
  <p className="text-foreground">
    {remaining} of {totalCapacity} tickets remaining
  </p>
</div>

                </div>
              </div>

              {/* Ticket Variants */}
              <div className="mb-6">
                <h3 className="text-xl mb-4 text-[#042029] dark:text-white">Select Ticket Type</h3>
                <div className="space-y-3">
                  {ticketVariants.length > 0 ? (
                    ticketVariants.map((variant) => (
                      <div
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setQuantity(1);
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedVariant?.id === variant.id
                            ? "border-[#00B4D8] bg-[#00B4D8]/5"
                            : "border-gray-200 dark:border-white/10 hover:border-[#00B4D8]/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg text-[#042029] dark:text-white">{variant.name}</h4>
                              {selectedVariant?.id === variant.id && (
                                <div className="w-5 h-5 rounded-full bg-[#00B4D8] flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {variant.price.toLocaleString()} Fbu
                            </p>
                            <ul className="space-y-1">
                              {variant.benefits.map((benefit, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                                >
                                  <Check className="w-3 h-3 text-[#00B4D8]" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-xs text-gray-500 mt-1">{variant.availability} available</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No ticket variants available.</p>
                  )}
                </div>
              </div>

              {/* Ticket Purchase */}
              {selectedVariant && (
                <div className="mt-auto p-6 rounded-2xl bg-gradient-to-br from-[#00B4D8]/10 to-[#0077B6]/10 border border-[#00B4D8]/20">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price per ticket</p>
                      <p className="text-3xl text-[#00B4D8]">{selectedVariant.price.toLocaleString()} Fbu</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-[#042029] rounded-full px-4 py-2">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= maxQuantity}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-300 dark:border-white/10">
                    <span className="text-lg">Total</span>
                    <span className="text-2xl text-[#00B4D8]">
                      {(selectedVariant.price * quantity).toLocaleString()} Fbu
                    </span>
                  </div>

                  <button
                    onClick={handleBuyTickets}
                    disabled={selectedAvailability <= 0}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#00B4D8] to-[#0077B6] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    <Ticket className="w-5 h-5" />
                    {selectedAvailability <= 0 ? "Sold Out" : "Buy Tickets"}
                  </button>

                  {selectedAvailability > 0 && selectedAvailability <= 20 && (
                    <p className="text-sm text-center text-orange-500 mt-3">
                      Only {selectedAvailability} {selectedVariant.name} tickets left!
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
