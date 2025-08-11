import milafcolaImage from "@/assets/milafcola.png";

export const MilafColaPage3 = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-700 via-red-600 to-red-500 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
      
      <div className="container mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Ready to
              <span className="block bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                Experience?
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-lg">
              Join millions of satisfied customers who have made Milaf Cola their beverage of choice. 
              Available worldwide in stores and online.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Available in 330ml, 500ml, and 1L bottles</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Diet and Zero Sugar options available</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Bulk orders for events and businesses</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-white text-red-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-red-50 transition-colors">
                Find Near You
              </button>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
          
          {/* Milaf Cola Can Stack */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative flex flex-col items-center">
              <img 
                src={milafcolaImage} 
                alt="Milaf Cola Can"
                className="w-48 h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500 mb-4"
              />
              <img 
                src={milafcolaImage} 
                alt="Milaf Cola Can"
                className="w-40 h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500 mb-4 opacity-80"
              />
              <img 
                src={milafcolaImage} 
                alt="Milaf Cola Can"
                className="w-32 h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500 opacity-60"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm animate-float">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-500 rounded-full" />
            </div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm animate-float" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-16 pt-8 border-t border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/60">
            <div>
              <h4 className="font-semibold text-white mb-2">Customer Service</h4>
              <p>1-800-MILAF-COLA</p>
              <p>support@milafcola.com</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Business Inquiries</h4>
              <p>business@milafcola.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Follow Us</h4>
              <p>@milafcola</p>
              <p>#MilafCola</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
