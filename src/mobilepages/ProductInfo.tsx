import React, { useEffect } from "react";
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

  // Hide scrollbar for the product grid
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
      <section id="product-info-section" className="relative min-h-screen w-full overflow-hidden">
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
          PRODUCTS
        </h1>

      </div>
      
      {/* Products Grid - Scrollable for mobile with proper gaps and transparency */}
      <div className="absolute z-20 inset-x-[4%] top-28 sm:top-32 md:top-36 lg:top-40 xl:top-44 max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-250px)] md:max-h-[calc(100vh-300px)] overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 md:gap-10 pb-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl h-[380px] sm:h-[400px] md:h-[420px] lg:h-[440px] xl:h-[460px] w-full"
                onClick={() => {
                  onProductSelect(product.id);
                  setTimeout(() => {
                    const productDetailSection = document.querySelector(
                      ".product-detail-section"
                    );
                    if (productDetailSection) {
                      productDetailSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }, 200);
                }}
              >
                {/* Card */}
                <div
                  className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/30 h-full w-full flex flex-col bg-white/10 backdrop-blur-sm"
                  style={{ background: product.gradient }}
                >
                  {/* Product Image */}
                  <div className="relative flex justify-center items-center h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56 p-4 w-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 text-black px-3 py-1.5 rounded-full text-sm font-bold shadow-md">
                      {product.category}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 sm:p-5 bg-white/20 backdrop-blur-sm flex-1 flex flex-col justify-between w-full">
                    <h3
                      className="text-lg sm:text-xl font-bold mb-2 leading-tight"
                      style={{
                        color:
                          product.name === "Milaf Cola" ? "#BF7E3E" : "white",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color:
                          product.name === "Milaf Cola"
                            ? "#BF7E3E"
                            : "rgba(255,255,255,0.95)",
                      }}
                    >
                      {product.description}
                    </p>
                    <div className="mt-3">
                      <button
                        className="w-full px-4 py-2.5 bg-white/30 hover:bg-white/40 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 border border-white/50 shadow-lg backdrop-blur-sm"
                        style={{
                          color:
                            product.name === "Milaf Cola" ? "#BF7E3E" : "white",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onProductSelect(product.id);
                          setTimeout(() => {
                            const productDetailSection =
                              document.querySelector(".product-detail-section");
                            if (productDetailSection) {
                              productDetailSection.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }
                          }, 200);
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      </section>
      
    </>
  );
};
