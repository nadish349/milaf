import footerframeImage from "@/assets/footerframe.png";

export const CompanyInfoSection = () => {
  return (
    <section 
      id="company-info-section-mobile"
      className="relative min-h-screen w-full overflow-hidden snap-start snap-always bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${footerframeImage})`
      }}
    >
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center pt-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Company Title */}
            <h2 className="text-sm sm:text-base md:text-lg font-bold mb-4 sm:mb-6 max-sm:text-xs">
              Milaf Cola Australia & NZ Pty Ltd
            </h2>
            
            {/* Subtitle */}
            <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-6 sm:mb-8 text-white/90 max-sm:text-xs">
              Silians Paris Group Pty Ltd – Exclusive Distributor for Australia & New Zealand
            </h3>
            
            {/* Company Description */}
            <div className="space-y-4 sm:space-y-6 text-xs sm:text-sm md:text-base leading-relaxed">
              <p className="text-white/90 max-sm:text-xs">
                Milaf Cola Australia & NZ Pty Ltd proudly represents the global Milaf Cola brand across Australia, New Zealand, and international markets. As the exclusive distributor under Silians Paris Group Pty Ltd, we bring the unique taste of Milaf Cola to wholesalers, retailers, and consumers who value quality and authenticity.
              </p>
              
              <p className="text-white/90 max-sm:text-xs">
                We specialize in bulk supply, wholesale distribution, and retail partnerships, while strengthening our presence in global markets.
              </p>
              
              <p className="text-white/90 max-sm:text-xs">
                By choosing Milaf Cola, you partner with a brand committed to innovation, authenticity, and global reach. Whether you're looking to book Milaf Cola, source wholesale quantities, or connect with an official distributor, our mission is to deliver excellence at every step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
