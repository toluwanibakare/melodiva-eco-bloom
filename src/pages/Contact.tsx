import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [review, setReview] = useState({ name: "", rating: "", comment: "" });
  const { toast } = useToast();

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback.",
    });
    setReview({ name: "", rating: "", comment: "" });
  };

  return (
    <section className="py-16 px-6 md:px-16 bg-background min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-foreground mb-4">
          Contact Us
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Have questions, feedback, or want to partner with us? We'd love to hear from you!
        </p>

        {/* Contact Info & Form */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <Card className="p-6 bg-card border-border animate-fade-in">
            <h3 className="text-xl font-semibold text-foreground mb-4">Get in Touch</h3>
            <p className="text-muted-foreground mb-6">
              Reach out anytime for inquiries or partnerships!
            </p>
            <ul className="space-y-3 text-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span><strong>Address:</strong> Lagos, Nigeria</span>
              </li>

              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <span><strong>Email:</strong> melodivaproducts@gmail.com</span>
              </li>

              <li className="flex items-start gap-2">
                <FaWhatsapp className="h-5 w-5 text-primary mt-0.5" />
                <span><strong>WhatsApp:</strong> +234 801 234 5678</span>
              </li>
            </ul>
          </Card>

          {/* Contact Form */}
          <Card className="p-6 bg-card border-border animate-fade-in">
            <h4 className="text-lg font-semibold text-foreground mb-4">Send a Message</h4>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us what's on your mind..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </Card>
        </div>

        {/* Review Section */}
        <Card className="p-6 bg-card border-border animate-fade-in">
          <h3 className="text-xl font-semibold text-foreground mb-4">Leave a Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <Label htmlFor="reviewName">Your Name</Label>
              <Input
                id="reviewName"
                type="text"
                placeholder="Your name"
                value={review.name}
                onChange={(e) => setReview({ ...review, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Select value={review.rating} onValueChange={(value) => setReview({ ...review, rating: value })} required>
                <SelectTrigger id="rating">
                  <SelectValue placeholder="Select your rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                  <SelectItem value="2">⭐⭐ Fair</SelectItem>
                  <SelectItem value="1">⭐ Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience with us..."
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                required
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Review
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
