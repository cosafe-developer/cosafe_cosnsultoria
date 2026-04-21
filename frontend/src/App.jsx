import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import FloatingMenu from "./components/ui/FloatingMenu.jsx";
import PrivacyBanner from "./components/ui/PrivacyBanner.jsx";
import Home from "./pages/Home.jsx";
import ConsultaDOF from "./pages/ConsultaDOF.jsx";
import LoadingScreen from "./components/ui/LoadingScreen.jsx";

/**
 * Hook de Google Analytics 4 para SPAs.
 * Dispara un evento `page_view` en cada cambio de ruta de React Router.
 * Se ejecuta solo si `gtag` está disponible (GA cargado) y respeta el
 * estado de consentimiento (Consent Mode v2 maneja si envía o no la hit).
 */
function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path:  location.pathname + location.search,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);
}

function Layout() {
  const { content, loading } = useApp();
  usePageTracking();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <FloatingMenu />
      <PrivacyBanner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/consultadof" element={<ConsultaDOF />} />
      </Routes>
      <Footer content={content} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}
