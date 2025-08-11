import milafcolaImage from "@/assets/milafcola.png";

export const MilafColaPage1 = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-red-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
      
      <div className="container mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left animate-fade-in">
                         <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              About Milaf Cola
             </h1>
            <p className="text-xl text-white/80 mb-8 max-w-lg">
              Experience the perfect blend of tradition and innovation. 
              Milaf Cola brings you the authentic taste that generations have loved, 
              crafted with premium ingredients and uncompromising quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-white text-red-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-red-50 transition-colors">
                Learn More
              </button>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors">
                Our Story
              </button>
            </div>
          </div>
          
          {/* Milaf Cola Can */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <img 
                src={milafcolaImage} 
                alt="Milaf Cola Can"
                className="w-full max-w-md h-auto mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent rounded-full" />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center animate-float">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/10 rounded-2xl backdrop-blur-sm animate-float" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};
