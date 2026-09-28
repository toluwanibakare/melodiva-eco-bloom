export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Are Melodiva products suitable for all skin types?",
    answer: "Yes! Our skincare formulations are made from 100% natural, plant-based Nigerian botanical ingredients designed to nourish and protect all skin types, including sensitive, acne-prone, and dry skin.",
    category: "Products"
  },
  {
    id: "faq-2",
    question: "How long does delivery take across Nigeria?",
    answer: "Doorstep delivery within Lagos is delivered via registered dispatch riders within 24 to 48 hours. Interstate orders (Hub-to-Hub or Interstate + Doorstep) are dispatched via registered waybill transporters and arrive within 2 to 4 business days.",
    category: "Delivery"
  },
  {
    id: "faq-3",
    question: "What is your refund policy after an order is placed?",
    answer: "Please note our strict policy: No refunds will be issued once your order has been dispatched or handed over to our dispatch riders or interstate waybill transporters. Orders can only be amended or cancelled prior to dispatch.",
    category: "Orders & Refunds"
  },
  {
    id: "faq-4",
    question: "How does the Melodiva Affiliate Program work?",
    answer: "When you join as an affiliate, you receive a unique referral code. Customers who use your code get a 5% discount at checkout, and you earn competitive commissions on every completed purchase, which you can withdraw directly to your Nigerian bank account!",
    category: "Affiliates"
  },
  {
    id: "faq-5",
    question: "How do I track my order status?",
    answer: "You can track your order anytime by visiting our Order Tracking page or clicking the link sent to your email/WhatsApp. You can also view past orders in your customer profile dashboard.",
    category: "Delivery"
  },
  {
    id: "faq-6",
    question: "What should I do if my package arrives damaged?",
    answer: "Please inspect your order upon receipt. If an item arrives damaged, take a photo/video immediately and contact our WhatsApp support (+234 807 872 5283) within 24 hours for a prompt replacement.",
    category: "Orders & Refunds"
  }
];
