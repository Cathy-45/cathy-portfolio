import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-[#1a1a1a] p-4 sticky top-0 z-10">
      <ul className="flex space-x-6 justify-center text-white font-poppins">
        <li><NavLink to="/" className="hover:text-[#ff6f61] data-[active=true]:text-[#ff6f61]">Home</NavLink></li>
        <li><NavLink to="/products" className="hover:text-[#ff6f61] data-[active=true]:text-[#ff6f61]">Products</NavLink></li>
        <li><NavLink to="/consultation" className="hover:text-[#ff6f61] data-[active=true]:text-[#ff6f61]">Consultation</NavLink></li>
        <li><NavLink to="/contact" className="hover:text-[#ff6f61] data-[active=true]:text-[#ff6f61]">Contact</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;