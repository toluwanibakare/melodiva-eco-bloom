import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/2348078725283"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-3 right-3 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-transform transform hover:scale-110"
      aria-label="Chat with us on WhatsApp"
    >
      <FaWhatsapp size={25} />
    </a>
  );
};

export default WhatsAppButton;
