import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ScrollToTop } from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Checkout } from './pages/Checkout';
import { About } from './pages/About';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { EventCheckout } from './pages/EventCheckout';
import { HostEvent } from './pages/HostEvent';
import { Services } from './pages/Services';
import { ServiceDetails } from './pages/ServiceDetails';
import { MenuItemDetails } from './pages/MenuItemDetails';
import { Spaces } from './pages/Spaces';
import { ConfirmPayment } from './pages/ConfirmPayment';
import { Toaster } from 'sonner';
import { useAutoTheme } from './hooks/useAutoTheme';
import { useSiteSettings } from './context/SiteSettingsContext';

const AppShell: React.FC = () => {
  const { settings } = useSiteSettings();

  React.useEffect(() => {
    document.title = settings.business_name || 'Website';
  }, [settings.business_name]);

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
          <Header />
          <main className="w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:itemId" element={<MenuItemDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eventId" element={<EventDetails />} />
              <Route path="/event-checkout" element={<EventCheckout />} />
              <Route path="/host-event" element={<HostEvent />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<ServiceDetails />} />
              <Route path="/spaces" element={<Spaces />} />
              <Route path="/confirm-payment" element={<ConfirmPayment />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--aqua)',
                color: 'white',
                border: 'none',
              },
            }}
          />
        </div>
      </Router>
    </CartProvider>
  );
};

export default function RootApp() {

  // Enable automatic day/night theme switching
  useAutoTheme();
  
  return (
    <AdminProvider>
      <SiteSettingsProvider>
        <AppShell />
      </SiteSettingsProvider>
    </AdminProvider>
  );
}
