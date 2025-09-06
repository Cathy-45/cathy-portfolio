import React from 'react';
import { Link } from 'react-router-dom';
const Success = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-white p-4 sm:p-6 md:p-10">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins font-bold mb-6 text-center text-[#fdba74]">
        Payment Successful
      </h2>
      <p className="text-lg sm:text-xl font-roboto text-[#9ca3af] mb-4">
        Thank you for your payment! You will receive a confirmation email soon.
      </p>
      <Link
        to="/consultation"
        className="text-sm sm:text-lg font-poppins text-white bg-[#fdba74] hover:bg-[#fb923c] px-4 sm:px-6 py-2 rounded-lg transition-colors"
      >
        Back to Consultation
      </Link>
    </section>
  );
};
export default Success;
