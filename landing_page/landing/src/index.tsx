import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Home } from "./screens/Home";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { useLenis } from "./hooks/useLenis";

function App() {
  useLenis();
  return (
    <>
      <Navigation />
      <Home />
      <Footer />
    </>
  );
}

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);