export const MilafColaPage2 = () => {
  const features = [
    {
      icon: "🌿",
      title: "Natural Ingredients",
      description: "Made with carefully selected natural ingredients and pure spring water for authentic taste."
    },
    {
      icon: "⚡",
      title: "Perfect Carbonation",
      description: "Expertly balanced carbonation that delivers the signature crisp, refreshing fizz."
    },
    {
      icon: "🎯",
      title: "Premium Quality",
      description: "Every batch is crafted with precision to ensure consistent, exceptional quality."
    },
    {
      icon: "🌍",
      title: "Eco-Friendly",
      description: "Committed to sustainable practices and environmentally responsible packaging."
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-800 via-red-700 to-red-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
      
      <div className="container mx-auto px-6 z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Why Choose
            <span className="block bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
              Milaf Cola?
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Discover what makes Milaf Cola the preferred choice for cola enthusiasts worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-8 text-white/60">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-sm">Years of Excellence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100+</div>
              <div className="text-sm">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1M+</div>
              <div className="text-sm">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
