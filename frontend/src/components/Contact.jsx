import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import backgroundImage from "../assets/background.jpg";

const Contact = () => {
  return (
    <section
      className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-10"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(26, 26, 26, 0.96)",
        opacity: 0.3,
        backgroundPosition: "center top",
        backgroundSize: "contain",
      }}
    >
      <div className="text-4xl sm:text-6xl animate-wave mb-4 sm:mb-6">👋</div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-poppins font-bold mb-4 sm:mb-6 text-center text-[#fdba74]">
        Thank you for visiting!
      </h2>
      <p className="text-base sm:text-lg md:text-xl font-roboto text-[#9ca3af] text-center">
        {" "}
      </p>
      Have a project or question? Let’s discuss how I can help
      <div
        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6
      "
      ></div>
      <Routes>
        <Route
          path="email"
          element={
            <p className="text-base sm:text-lg md:text-xl font-roboto text-[#9ca3af] text-center">
              Email:{" "}
              <a
                href="mailto:catherine.sichone@gmail.com"
                className="text-[#fdba74] hover:underline"
              >
                catherine.sichone@gmail.com
              </a>
            </p>
          }
        />
        <Route
          path="phone"
          element={
            <p className="text-base sm:text-lg md:text-xl font-roboto text-[#9ca3af] text-center">
              Phone:{" "}
              <a
                href="tel:+4694634053"
                className="text-[#fdba74] hover:underline"
              >
                +14694634053
              </a>
            </p>
          }
        />
        <Route
          path="/"
          element={
            <>
              <p className="text-base sm:text-lg md:text-xl font-roboto text-[#9ca3af] mb-2 text-center">
                Email:{" "}
                <a
                  href="mailto:catherine.sichone@gmail.com"
                  className="text-[#fdba74] hover:underline"
                >
                  catherine.sichone@gmail.com
                </a>
              </p>
              <p className="text-base sm:text-lg md:text-xl font-roboto text-[#9ca3af] text-center">
                Phone:{" "}
                <a
                  href="tel:+4694634053"
                  className="text-[#fdba74] hover:underline"
                >
                  +14694634053
                </a>
              </p>
            </>
          }
        />
      </Routes>
    </section>
  );
};

export default Contact;
