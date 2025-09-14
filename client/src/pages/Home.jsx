import React from "react";
import pic from "../pic.avif";

export default function Home() {
  return (
    <main>
      <Hero />
      <img src={pic} alt="volcano" />
    </main>
  );
}

// hero content
const Hero = () => (
  <section className="hero">
    {/* content for the hero */}
    <div className="hero_content">
      <h1 className="hero_title">Volcanos Of The World</h1>
    </div>
  </section>
);
