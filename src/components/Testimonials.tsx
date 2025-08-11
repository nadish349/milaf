import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechStart",
    avatar: "SC",
    content: "This platform transformed our entire workflow. We've seen a 300% increase in productivity and our team couldn't be happier.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "CTO, DataFlow",
    avatar: "MR",
    content: "The integration capabilities are outstanding. We connected all our tools seamlessly and automated 90% of our manual processes.",
    rating: 5
  },
  {
    name: "Emily Johnson",
    role: "Product Manager, InnovateCorp",
    avatar: "EJ",
    content: "Security was our main concern, but this platform exceeded all our expectations. Enterprise-grade protection with incredible ease of use.",
    rating: 5
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Loved by
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              thousands
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join the growing community of businesses that have transformed 
            their operations with our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name} 
              className="hover:shadow-card transition-all duration-300 border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-foreground mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}`} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};