import React from "react";
import m1 from "@/assets/m1.png";
import milafcola from "@/assets/milafcola.png";
import chocospread from "@/assets/chocospread.png";
import datespread from "@/assets/datespread.png";
import safawidates from "@/assets/safawidates.png";
import segaidates from "@/assets/segaidates.png";
import khalasdates from "@/assets/khalasdates.png";

interface ProductInfoProps {
  onProductSelect: (productId: number) => void;
}

export const ProductInfo = ({ onProductSelect }: ProductInfoProps) => {


  const products = [
    {
      id: 0,
      name: "Milaf Cola",
      image: milafcola,
      description: "Saudi Arabia's unique twist on a classic favorite, infused with the rich natural sweetness of premium local dates.",
      gradient: "linear-gradient(135deg, #66A992, #FFFFFF)",
      category: "Beverages"
    },
    {
      id: 1,
      name: "Choco Spread",
      image: chocospread,
      description: "Rich chocolate spread made with premium Saudi dates, perfect for breakfast and desserts.",
      gradient: "linear-gradient(135deg, #743002, #7C3C16)",
      category: "Spreads"
    },
    {
      id: 2,
      name: "Date Spread",
      image: datespread,
      description: "Pure date spread made from the finest Saudi dates, naturally sweet and nutritious.",
      gradient: "linear-gradient(135deg, #CE8437, #FBDCA4)",
      category: "Spreads"
    },
    {
      id: 3,
      name: "Segai Dates",
      image: segaidates,
      description: "Golden dates with a unique flavor profile, offering a distinct culinary experience.",
      gradient: "linear-gradient(135deg, #722E17, #D8582C)",
      category: "Dates"
    },
    {
      id: 4,
      name: "Safawi Dates",
      image: safawidates,
      description: "Premium black dates known for their rich flavor and soft texture, sourced from the finest groves.",
      gradient: "linear-gradient(135deg, #D69150, #B66325)",
      category: "Dates"
    },
    {
      id: 5,
      name: "Khalas Dates",
      image: khalasdates,
      description: "Sweet and tender dates with a caramel-like taste, perfect for snacking and cooking.",
      gradient: "linear-gradient(135deg, #98371F, #A94733)",
      category: "Dates"
    }
  ];

  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden snap-start snap-always">
      {/* Background image - m1.png */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${m1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Main title - "DATE'S PRODUCTS" */}
      <div className="absolute z-20 left-[50%] transform -translate-x-1/2 top-[60px] sm:top-[70px] md:top-[80px] lg:top-[90px] xl:top-[100px] max-sm:top-[40px] max-sm:px-4">
        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight tracking-wide text-center max-sm:text-sm">
          DATE'S PRODUCTS
        </h1>

      </div>
      
      {/* Products Grid */}
      <div className="absolute z-20 left-[5%] right-[5%] top-[120px] sm:top-[140px] md:top-[160px] lg:top-[180px] xl:top-[200px] max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:right-auto max-sm:top-[80px] max-sm:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6 max-w-[1200px] mx-auto">
          {products.map((product) => (
                         <div
               key={product.id}
               className="relative group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl h-[280px] sm:h-[300px] md:h-[320px] lg:h-[340px] xl:h-[360px]"
               onClick={() => {
                 console.log('Product card clicked:', product.id, product.name);
                 // Call the parent function to update the selected product
                 onProductSelect(product.id);
                 // Navigate directly to ProductDetail section
                 setTimeout(() => {
                   const productDetailSection = document.querySelector('.product-detail-section');
                   if (productDetailSection) {
                     console.log('Scrolling to ProductDetail section');
                     productDetailSection.scrollIntoView({ 
                       behavior: 'smooth', 
                       block: 'start',
                       inline: 'nearest'
                     });
                   } else {
                     console.log('ProductDetail section not found');
                   }
                 }, 200);
               }}
             >
              {/* Product Card */}
                             <div 
                 className="relative overflow-hidden rounded-2xl shadow-xl border border-white/20 h-full flex flex-col"
                 style={{
                   background: product.gradient
                 }}
               >
                                 {/* Product Image */}
                 <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 overflow-hidden">
                   <img
                     src={product.image}
                     alt={product.name}
                     className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                   />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 text-black px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                    {product.category}
                  </div>
                </div>
                
                                 {/* Product Info */}
                 <div className="p-4 bg-white/10 backdrop-blur-sm flex-1 flex flex-col justify-between">
                   <h3 
                     className="text-lg sm:text-xl font-bold mb-2 leading-tight"
                     style={{ color: product.name === "Milaf Cola" ? "#BF7E3E" : "white" }}
                   >
                     {product.name}
                   </h3>
                   
                   <p 
                     className="text-xs sm:text-sm leading-relaxed"
                     style={{ color: product.name === "Milaf Cola" ? "#BF7E3E" : "rgba(255, 255, 255, 0.9)" }}
                   >
                     {product.description}
                   </p>
                   
                   {/* Buy Now Button */}
                   <div className="mt-3">
                     <button 
                       className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30"
                       style={{ color: product.name === "Milaf Cola" ? "#BF7E3E" : "white" }}
                       onClick={(e) => {
                         e.stopPropagation(); // Prevent card click from firing
                         console.log('Buy Now button clicked for:', product.id, product.name);
                         // Call the parent function to update the selected product
                         onProductSelect(product.id);
                         // Navigate directly to ProductDetail section
                         setTimeout(() => {
                           const productDetailSection = document.querySelector('.product-detail-section');
                           if (productDetailSection) {
                             console.log('Scrolling to ProductDetail section');
                             productDetailSection.scrollIntoView({ 
                               behavior: 'smooth', 
                               block: 'start',
                               inline: 'nearest'
                             });
                           } else {
                             console.log('ProductDetail section not found');
                           }
                         }, 200);
                       }}
                     >
                       Buy Now
                     </button>
                   </div>
                 </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Hover Effect Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
            </div>
          ))}
        </div>
      </div>


      </section>
      
    </>
  );
};
