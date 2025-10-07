"use client";

import React from "react";
import Link from "next/link"; // <-- add this
import "@fortawesome/fontawesome-free/css/all.css";
import GymfolioPricing from "./components/GymfolioPricing";
import ContactSection from "../main/components/ContactSection";
import HeroAbout from "../about-us/components/HeroAbout";
const Packages = () => {
  return (
    <main className="pt-20">
      
        <HeroAbout />
            <GymfolioPricing />
            <ContactSection/>
           
         
    </main>
  );
};

export default Packages;