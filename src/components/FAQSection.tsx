import { useState } from 'react';
import { HelpCircle, LifeBuoy } from 'lucide-react';
import { FAQS } from '@/data/faqs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const FAQSection = ({
  title = "Frequently Asked Questions",
  subtitle = "Got questions about our natural skincare products, delivery across Nigeria, or affiliate program? Find your answers below.",
  className = "",
}: FAQSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Products', 'Delivery', 'Orders & Refunds', 'Affiliates'];

  const filteredFaqs = selectedCategory === 'All'
    ? FAQS
    : FAQS.filter(faq => faq.category === selectedCategory);

  return (
    <section className={`py-16 px-4 max-w-4xl mx-auto ${className}`}>
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <LifeBuoy className="h-3.5 w-3.5" />
          <span>Help & Support</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : 'bg-secondary/70 text-secondary-foreground hover:bg-secondary hover:scale-102'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Accordion Component */}
      <div className="bg-card/70 backdrop-blur-md rounded-2xl border border-primary/10 p-6 shadow-sm">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {filteredFaqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border border-border/60 rounded-xl px-4 py-1 transition-all duration-300 data-[state=open]:border-primary/50 data-[state=open]:bg-primary/5"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground text-sm md:text-base hover:no-underline hover:text-primary">
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pt-1 pb-3 pl-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
