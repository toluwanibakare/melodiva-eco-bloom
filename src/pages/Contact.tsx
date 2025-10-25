import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [review, setReview] = useState({ name: "", rating: "", comment: "" });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Message submitted successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    alert("Review submitted. Thank you!");
    setReview({ name: "", rating: "", comment: "" });
  };

  return (
    <section className="py-12 px-6 md:px-16 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Contact Us
        </h2>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Get in Touch</h3>
            <p className="text-gray-600 mb-4">
              Have questions, feedback, or want to partner with us? Reach out anytime!
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Address:</strong>Lagos, Nigeria</li>
              <li><strong>Email:</strong> melodivaproducts@gmail.com</li>
              <li><strong>WhatsApp:</strong> +234 801 234 5678</li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4">Send a Message</h4>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border rounded p-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded p-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <textarea
                placeholder="Your Message"
                className="w-full border rounded p-2 h-28"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
              <button
                type="submit"
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave a Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded p-2"
              value={review.name}
              onChange={(e) => setReview({ ...review, name: e.target.value })}
              required
            />
            <select
              className="w-full border rounded p-2"
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: e.target.value })}
              required
            >
              <option value="">Select Rating</option>
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Very Good</option>
              <option value="3">⭐⭐⭐ Good</option>
              <option value="2">⭐⭐ Fair</option>
              <option value="1">⭐ Poor</option>
            </select>
            <textarea
              placeholder="Write your review..."
              className="w-full border rounded p-2 h-24"
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
