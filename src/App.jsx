// App.jsx
import LusionAboutSection from "./components/LusionAboutSection";
import "./index.css";

export default function App() {
  return (
    <main>
      {/* Spacer so the about section isn't at the very top
      <div style={{ height: "100vh", background: "#eceef5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#666", opacity: 0.4 }}>
          Scroll Down ↓
        </p>
      </div> */}

      {/* THE ANIMATION */}
      <LusionAboutSection />

      {/* Next section */}
      <div style={{ height: "100vh", background: "#0f1022", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "white", opacity: 0.2, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Featured Work
        </p>
      </div>
    </main>
  );
}