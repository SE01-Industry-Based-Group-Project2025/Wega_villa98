import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  // Generate random bubbles with different properties
  const generateBubbles = (count) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: `${Math.random() * 12 + 8}px`,
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * 30}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${Math.random() * 15 + 15}s`,
      opacity: Math.random() * 0.4 + 0.2
    }));
  };

  const bubbles = generateBubbles(20);

  return (
    <footer className="bg-[#E5D0AC] text-black pt-12 pb-12 px-6 md:px-12 relative overflow-hidden">
      {/* Bubble Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full bg-amber-900"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: bubble.left,
              bottom: bubble.bottom,
              animation: `bubbleFloat ${bubble.duration} ease-in-out infinite`,
              animationDelay: bubble.delay,
              opacity: bubble.opacity,
              transform: "translateY(0)"
            }}
          />
        ))}
      </div>

      {/* Footer Content */}
      <div className="relative z-10 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Address */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              Wega Villa <span className="text-amber-500">98</span>
            </h2>
            <address className="not-italic text-sm">
              <p>Hikkaduwatta Road, Unawatuna, Galle</p>
              <p>80600 Unawatuna, Sri Lanka</p>
              <p className="mt-2">+94 123 4567</p>
              <p>Email: wegavilla@gmail.com</p>
            </address>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>            <ul className="space-y-2 text-sm">
              {["About Us", "Facilities", "Travel", "Reservation", "Offers"].map((item) => (
                <li key={item}>
                  <button className="hover:text-amber-500 transition text-left">{item}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Information</h3>            <ul className="space-y-2 text-sm">
              {["Privacy Policy", "Terms of Service", "Gallery", "FAQs", "Careers"].map((item) => (
                <li key={item}>
                  <button className="hover:text-amber-500 transition text-left">{item}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact / Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/your-number"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black text-2xl hover:text-amber-500 transition"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black text-2xl hover:text-amber-500 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black text-2xl hover:text-amber-500 transition"
              >
                <FaInstagram />
              </a>
            </div>
            <p className="text-sm mt-4">
              Feel free to message us any time through our channels!
            </p>
          </div>
        </div>

        {/* Bottom Footer Line */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-700 text-sm">© 2025 Wega Villa 98. All rights reserved.</p>
          <p className="text-gray-700 text-sm mt-2 md:mt-0">Web Design | Created by Group5</p>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx global>{`
        @keyframes bubbleFloat {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: ${bubbles[0]?.opacity || 0.3};
          }
          80% {
            opacity: ${bubbles[0]?.opacity || 0.3};
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
