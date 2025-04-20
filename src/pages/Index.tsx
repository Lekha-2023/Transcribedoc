
import { Link } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import CTASection from "@/components/home/CTASection";
import DemoUpload from "@/components/home/DemoUpload";

const Index = () => {
  const isLoggedIn = isAuthenticated();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} />
      <HeroSection isLoggedIn={isLoggedIn} />
      <FeaturesSection />
      <DemoUpload />
      <BenefitsSection />
      <CTASection isLoggedIn={isLoggedIn} />
      <Footer />
    </div>
  );
};

export default Index;
