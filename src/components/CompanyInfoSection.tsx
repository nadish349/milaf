import footerframeImage from "@/assets/footerframe.png";

export const CompanyInfoSection = () => {
  return (
    <section 
      id="company-info-section"
      className="relative min-h-screen w-full overflow-hidden snap-start snap-always bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${footerframeImage})`
      }}
    >
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center pt-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Company Title */}
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-6 sm:mb-8">
              Milaf Cola Australia & NZ Pty Ltd
            </h2>
            
            {/* Subtitle */}
            <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-8 sm:mb-12 text-white/90">
              Silians Paris Group Pty Ltd – Exclusive Distributor for Australia & New Zealand
            </h3>
            
            {/* Company Description */}
            <div className="space-y-6 sm:space-y-8 text-sm sm:text-base md:text-lg leading-relaxed">
              <p className="text-white/90">
                Milaf Cola Australia & NZ Pty Ltd proudly represents the global Milaf Cola brand across Australia, New Zealand, and international markets. As the exclusive distributor under Silians Paris Group Pty Ltd, we bring the unique taste of Milaf Cola to wholesalers, retailers, and consumers who value quality and authenticity.
              </p>
              
              <p className="text-white/90">
                We specialize in bulk supply, wholesale distribution, and retail partnerships, while strengthening our presence in global markets.
              </p>
              
              <p className="text-white/90">
                By choosing Milaf Cola, you partner with a brand committed to innovation, authenticity, and global reach. Whether you're looking to book Milaf Cola, source wholesale quantities, or connect with an official distributor, our mission is to deliver excellence at every step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
