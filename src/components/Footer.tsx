import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import footerframeImage from "@/assets/footerframe.png";
import skywardforgeLogo from "@/assets/skywardforge.svg";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  const handleProductClick = (productId: number) => {
    // Scroll to the product detail section
    const productDetailSection = document.getElementById('product-detail-section');
    
    if (productDetailSection) {
      productDetailSection.scrollIntoView({ behavior: 'smooth' });
      
      // Dispatch a custom event to change the product
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('changeProduct', { detail: { productId } }));
      }, 500); // Small delay to ensure scroll completes
    }
  };

  const handleBusinessClick = (inquiryType: string) => {
    navigate(`/business-inquiry?type=${encodeURIComponent(inquiryType)}`);
  };

  return (
    <footer 
      id="footer-section"
      className="relative text-white overflow-hidden snap-start snap-always"
      style={{
        backgroundImage: `url(${footerframeImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* CTA Section */}
        <div className="text-center mb-8 sm:mb-16 pt-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 max-sm:text-lg">
            Milaf Cola Australia & NZ Pty Ltd
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 max-w-[280px] sm:max-w-2xl mx-auto max-sm:text-xs">
            Join thousands of customers already enjoying the premium taste and quality 
            of Milaf Cola across Australia and New Zealand.
          </p>
        </div>

        <Separator className="bg-background/20 mb-8 sm:mb-12" />

        {/* Footer Links */}
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 max-sm:text-base">Products</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-white/80 max-sm:text-xs">
              <li><button onClick={() => handleProductClick(0)} className="hover:text-white transition-colors cursor-pointer">Milaf Cola</button></li>
              <li><button onClick={() => handleProductClick(2)} className="hover:text-white transition-colors cursor-pointer">Dates Spread</button></li>
              <li><button onClick={() => handleProductClick(1)} className="hover:text-white transition-colors cursor-pointer">Choco Spread</button></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 max-sm:text-base">Regions</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-white/80 max-sm:text-xs">
              <li>Australia</li>
              <li>New Zealand</li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 max-sm:text-base">Business</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-white/80 max-sm:text-xs">
              <li><button onClick={() => handleBusinessClick('Distributors')} className="hover:text-white transition-colors cursor-pointer text-left">Distributors</button></li>
              <li><button onClick={() => handleBusinessClick('Wholesale')} className="hover:text-white transition-colors cursor-pointer text-left">Wholesale</button></li>
              <li><button onClick={() => handleBusinessClick('Bulk Orders')} className="hover:text-white transition-colors cursor-pointer text-left">Bulk Orders</button></li>
              <li><button onClick={() => handleBusinessClick('Partnerships')} className="hover:text-white transition-colors cursor-pointer text-left">Partnerships</button></li>
            </ul>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 max-sm:text-base">Company</h3>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-white/80 max-sm:text-xs">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/20 mb-6 sm:mb-8" />

        {/* Contact Information */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-white/90">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm sm:text-base">+61 401 855 965</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="text-sm sm:text-base">Mark@milafcola.com.au</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm sm:text-base">Sydney, Australia</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/60 mb-4 md:mb-0 text-center md:text-left text-sm sm:text-base max-sm:text-xs">
            © 2025 Milaf Cola. All rights reserved. | Silians Paris Group
            <div className="mt-2 text-blue-800 flex items-center gap-2">
              Created by{' '}
              <a 
                href="https://skywardforgetech.web.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-700 transition-colors underline flex items-center gap-2"
              >
                SkywardForge
                <img 
                  src={skywardforgeLogo} 
                  alt="SkywardForge Logo" 
                  className="h-[1.1rem] w-[1.1rem] sm:h-[1.375rem] sm:w-[1.375rem]"
                />
              </a>
            </div>
          </div>
          <div className="flex space-x-3 sm:space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => window.open('https://www.instagram.com/milafcola_australia', '_blank')}
            >
              <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => window.open('https://www.facebook.com/people/MilafCola-Australia/61576722392140/', '_blank')}
            >
              <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => window.open('https://www.tiktok.com/@milafcolaaustralia?lang=en', '_blank')}
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.11V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};