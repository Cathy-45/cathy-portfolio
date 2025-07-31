import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../../assets/background.jpg"; // Adjust path if needed

const SaaS = () => {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-white bg-contain bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(26, 26, 26, 0.96)",
        opacity: 0.3,
        backgroundPosition: "center top",
      }}
    >
      <h2 className="text-6xl font-poppins font-bold mb-8 text-center text-[#fdba74]">
        SaaS Solutions & Agile/DevOps
      </h2>
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-4">
        <div className="bg-[#2a2a2a] rounded-lg p-8 shadow-xl w-full">
          <p className="text-xl font-roboto font-light text-[#9ca3af] leading-relaxed mb-4">
            Our SaaS (Software-as-a-Service) solutions deliver scalable,
            cloud-based applications tailored to your business. We build
            subscription-based platforms that are secure, user-friendly, and
            accessible from anywhere. From customer management tools to
            analytics platforms, our solutions help you scale efficiently.
            Streamline workflows with CI/CD and Agile practices
          </p>
          <hr className="border-[#fdba74] border-opacity-50 my-4 w-1/2 mx-auto" />
          <p className="text-xl font-roboto font-light text-[#9ca3af] leading-relaxed mb-4">
            Features include multi-tenant architecture, regular updates, and
            seamless integration with your existing systems to maximize value
            for your users.
          </p>
        </div>
        <Link
          to="/products"
          className="text-[#fdba74] hover:underline font-poppins text-lg"
        >
          Back to Services
        </Link>
        <Link
          to="/consultation"
          className="text-lg font-poppins text-white bg-[#3F3F46] hover:bg-[#fb923c] px-6 py-2 rounded-lg transition-colors mt-6"
        >
          Book A Consultation Now!
        </Link>
      </div>
    </section>
  );
};

export default SaaS;
