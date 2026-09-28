import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { api } from "@/lib/api";
import FAQSection from "@/components/FAQSection";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [review, setReview] = useState({ name: "", rating: "", comment: "", isAnonymous: false });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (window.location.hash === '#review-section') {
      const element = document.getElementById('review-section');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.submitContactMessage(formData);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.submitReview({
        name: review.name,
        rating: parseInt(review.rating),
        comment: review.comment,
        is_anonymous: review.isAnonymous
      });
      toast({
        title: "Review Submitted!",
        description: review.isAnonymous 
          ? "Your anonymous review has been submitted. Thank you for your feedback."
          : "Thank you for your feedback.",
      });
      setReview({ name: "", rating: "", comment: "", isAnonymous: false });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-12 bg-background min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-center text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto text-sm">
            Have questions, feedback, or want to partner with us? We'd love to hear from you!
          </p>
        </div>

        {/* Contact Info & Form */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 bg-card border-border shadow-sm rounded-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-foreground mb-4">Get in Touch</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Reach out anytime for inquiries or partnerships!
            </p>
            <ul className="space-y-4 text-sm text-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span><strong>Address:</strong> Lagos, Nigeria</span>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span><strong>Email:</strong> melodivaproducts@gmail.com</span>
              </li>

              <li className="flex items-start gap-3">
                <FaWhatsapp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span><strong>WhatsApp:</strong> +234 807 872 5283</span>
              </li>
            </ul>
          </Card>

          {/* Contact Form */}
          <Card className="p-6 bg-card border-border shadow-sm rounded-2xl animate-fade-in">
            <h4 className="text-lg font-bold text-foreground mb-4">Send a Message</h4>
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
              <Button type="submit" className="w-full rounded-xl btn-primary" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Review Section */}
        <Card id="review-section" className="p-6 bg-card border-border shadow-sm rounded-2xl animate-fade-in scroll-mt-28">
          <h3 className="text-xl font-bold text-foreground mb-4">Leave a Product Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <Label htmlFor="reviewName">Your Name</Label>
              <Input
                id="reviewName"
                type="text"
                placeholder="Your name"
                value={review.name}
                onChange={(e) => setReview({ ...review, name: e.target.value })}
                required={!review.isAnonymous}
                disabled={review.isAnonymous}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={review.isAnonymous}
                onChange={(e) => setReview({ ...review, isAnonymous: e.target.checked, name: e.target.checked ? "Anonymous" : "" })}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                Submit as Anonymous
              </Label>
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
            <Button type="submit" className="w-full rounded-xl btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </Card>

        {/* Embedded FAQ Section */}
        <FAQSection className="pt-8" />
      </div>
    </section>
  );
}
