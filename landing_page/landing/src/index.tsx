import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./screens/Home";
import { About } from "./screens/About";
import { Cloud } from "./screens/Cloud";
import { Pricing } from "./screens/Pricing";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { GalaxyBackground } from "./components/GalaxyBackground";
import { WaitlistProvider } from "./components/waitlist/WaitlistProvider";
import { useLenis } from "./hooks/useLenis";
import { ScrollToTop } from "./components/ScrollToTop";
import { captureReferral } from "./lib/api";
import AudioPlayer from "./components/AudioPlayer";
import BackToTop from "./components/BackToTop";

function App() {
  useLenis();

  useEffect(() => {
    captureReferral();
  }, []);

  return (
    <BrowserRouter>
      <WaitlistProvider>
        <ScrollToTop />
        <GalaxyBackground />
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cloud" element={<Cloud />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
        <Footer />
        <AudioPlayer />
        <BackToTop />
      </WaitlistProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
