import React from "react";
import "./Hero.css";

function HeroSection() {
  return (
    <section className="hero">

      {/* Floating Images */}

      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500"
        className="img img1"
        alt=""
      />

      <img
        src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500"
        className="img img2"
        alt=""
      />

      <img
        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500"
        className="img img3"
        alt=""
      />

      <img
        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500"
        className="img img4"
        alt=""
      />

      {/* Text */}

      <div className="content">

        <h1 className="title">
          Take the leap like <br />
          millions before you
        </h1>

        <button>Start Now →</button>

      </div>

    </section>
  );
}

export default HeroSection;