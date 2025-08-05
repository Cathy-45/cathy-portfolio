import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import backgroundImage from '../assets/background.jpg';
const stripePromise = loadStripe('pk_test_51Rste9GNCTuQ8b5VvFoiyW33qLI7t7qHoHwcwq4S7vHcu9CgCtJRhq5nGbwbCm6zJwihJWEkzdwrLSlSTXMoudT9009UNkrut9');
const Consultation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    amount: 50,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    setIsSubmitting(true);
    try {
      const response = await fetch('https://cathy-portfolio-backend.onrender.com/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      if (!response.ok) {
        throw new Error(data.error || 'Unknown error');
      }
      setStatus('Thank you for your request! I will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '', amount: formData.amount });
      const paymentResponse = await fetch('https://cathy-portfolio-backend.onrender.com/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          amount: formData.amount,
        }),
      });
      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || 'Payment initiation failed');
      }
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: paymentData.id,
      });
      if (error) {
        console.error('Stripe error:', error);
        setStatus('Payment error: ' + error.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setStatus('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-white bg-contain bg-center p-4 sm:p-6 md:p-10"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(26, 26, 26, 0.96)',
        opacity: 0.3,
        backgroundPosition: 'center top',
        backgroundSize: 'contain',
      }}
    >
      <div className="text-4xl sm:text-6xl animate-wave mb-4 sm:mb-6">👋</div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-bold mb-6 sm:mb-8 text-center text-[#fdba74]">
        Book a Consultation
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full bg-[#2a2a2a] rounded-lg p-4 sm:p-6 md:p-8 shadow-xl"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm sm:text-base font-roboto text-[#9ca3af] mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[#1a1a1a] text-white border border-[#fdba74] border-opacity-50 focus:outline-none focus:border-[#fdba74]"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm sm:text-base font-roboto text-[#9ca3af] mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-[#1a1a1a] text-white border border-[#fdba74] border-opacity-50 focus:outline-none focus:border-[#fdba74]"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-sm sm:text-base font-roboto text-[#9ca3af] mb-2"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1a1a1a] text-white border border-[#fdba74] border-opacity-50 focus:outline-none focus:border-[#fdba74]"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm sm:text-base font-roboto text-[#9ca3af] mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 rounded bg-[#1a1a1a] text-white border border-[#fdba74] border-opacity-50 focus:outline-none focus:border-[#fdba74]"
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm sm:text-base font-roboto text-[#9ca3af] mb-2"
          >
            Amount (USD)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
            className="w-full p-2 rounded bg-[#1a1a1a] text-white border border-[#fdba74] border-opacity-50 focus:outline-none focus:border-[#fdba74]"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full text-sm sm:text-lg font-poppins text-white bg-[#fdba74] hover:bg-[#fb923c] px-4 sm:px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : 'Pay and Submit'}
        </button>
      </form>
    </section>
  );
};

export default Consultation;
