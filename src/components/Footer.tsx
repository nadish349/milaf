import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Twitter, Github, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background snap-start snap-always">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* CTA Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 max-sm:text-lg">
            Ready to transform your business?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-background/80 mb-6 sm:mb-8 max-w-[280px] sm:max-w-2xl mx-auto max-sm:text-xs">
            Join thousands of companies already using our platform to streamline 
            their operations and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="default" className="sm:size-lg" variant="glass">
              Start Free Trial
            </Button>
            <Button size="default" className="sm:size-lg border-background/30 text-background hover:bg-background/10" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>

        <Separator className="bg-background/20 mb-8 sm:mb-12" />

        {/* Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 max-sm:text-base">Product</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-background/80 max-sm:text-xs">
              <li><a href="#" className="hover:text-background transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-background transition-colors">API</a></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 max-sm:text-base">Company</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-background/80 max-sm:text-xs">
              <li><a href="#" className="hover:text-background transition-colors">About</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Press</a></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 max-sm:text-base">Support</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-background/80 max-sm:text-xs">
              <li><a href="#" className="hover:text-background transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Status</a></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 max-sm:text-base">Legal</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-background/80 max-sm:text-xs">
              <li><a href="#" className="hover:text-background transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>

        <Separator className="bg-background/20 mb-6 sm:mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-background/60 mb-4 md:mb-0 text-center md:text-left text-sm sm:text-base max-sm:text-xs">
            © 2024 ProductName. All rights reserved.
          </div>
          <div className="flex space-x-3 sm:space-x-4">
            <Button variant="ghost" size="icon" className="text-background/60 hover:text-background hover:bg-background/10">
              <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-background/60 hover:text-background hover:bg-background/10">
              <Github className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-background/60 hover:text-background hover:bg-background/10">
              <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-background/60 hover:text-background hover:bg-background/10">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};