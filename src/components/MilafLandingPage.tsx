import React, { useState, useMemo } from "react";

// --------------------------------------
// Milaf Date Cola – Single-File React Landing Page
// --------------------------------------
// How to use:
// 1) Drop this file into your project and render <MilafDateColaLanding />.
// 2) Replace PRODUCT_IMAGE.jpg with your real product image file (or upload via the Image Uploader in the Hero).
// 3) Update copy, links, and socials.
// 4) This is built with Tailwind classes for a clean, modern, responsive design.
//    It favors accessibility, SEO, and conversion-focused UX.

export const MilafLandingPage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const productImage = uploadedImage || "PRODUCT_IMAGE.jpg"; // <-- Replace with your actual image path

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Milaf Date Cola",
      image: [productImage],
      description:
        "A refreshing cola crafted with natural sweetness from dates. Zero added sugar, crisp fizz, modern flavor.",
      brand: { "@type": "Brand", name: "Milaf" },
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: "79.00",
        availability: "https://schema.org/InStock"
      }
    }),
    [productImage]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#84B393] via-[#6da085] to-[#3e5f4c] text-white antialiased">
      {/* SEO Hints (place these in <head> if using Next.js/CRA index.html) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky top announcement bar */}
      <div className="sticky top-0 z-50 backdrop-blur bg-white/5 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-sm">
          <p className="opacity-90">Introducing Milaf Date Cola — naturally sweetened with dates ✨</p>
          <a
            href="#buy"
            className="rounded-2xl bg-white/90 text-[#244133] px-3 py-1 font-semibold hover:bg-white transition shadow"
          >
            Buy Now
          </a>
        </div>
      </div>

      {/* HERO */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* soft radial highlights */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 pt-16 pb-12">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 w-fit rounded-2xl bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" /> New Product
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Cola, reimagined with <span className="underline decoration-white/60 underline-offset-4">Dates</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/90 max-w-xl">
              Meet <strong>Milaf Date Cola</strong>: crisp fizz, rich caramel notes, and natural sweetness from premium dates. Zero added sugar. 100% modern refreshment.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#buy"
                className="rounded-2xl bg-white text-[#244133] px-5 py-3 font-semibold shadow hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                Get Milaf Now
              </a>
              <a
                href="#story"
                className="rounded-2xl bg-white/10 px-5 py-3 font-semibold hover:bg-white/20 transition ring-1 ring-white/20"
              >
                Our Story
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-white/80">
              <Badge>Zero Added Sugar</Badge>
              <Badge>Vegan</Badge>
              <Badge>Eco-Friendly Can</Badge>
              <Badge>Made with Real Dates</Badge>
            </div>

            {/* Simple image uploader for quick swaps during demos */}
            <div className="mt-8 inline-flex items-center gap-3 text-xs opacity-90">
              <label htmlFor="uploader" className="cursor-pointer underline decoration-white/50 underline-offset-4">
                Upload product image
              </label>
              <input
                id="uploader"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setUploadedImage(reader.result);
                  reader.readAsDataURL(file);
                }}
              />
              <span aria-hidden>•</span>
              <span>or replace PRODUCT_IMAGE.jpg in code</span>
            </div>
          </div>

          {/* Product Visual */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-lg">
              <div className="absolute inset-0 blur-3xl rounded-full opacity-60 bg-white/20 scale-110" />
              <img
                src={productImage}
                alt="Milaf Date Cola can on a glossy surface with condensation"
                loading="lazy"
                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl rounded-2xl"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Value Props */}
      <section className="py-16" id="why">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Why you'll love Milaf</h2>
          <p className="mt-2 text-white/85 max-w-3xl">
            Crafted with date sweetness for a smoother, rounder cola profile. Designed for modern tastes and better choices.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Feature title="Naturally Sweetened" desc="Premium dates deliver deep caramel notes without refined sugar." />
            <Feature title="Crisp & Refreshing" desc="Fine bubbles and balanced acidity for a clean finish." />
            <Feature title="Better-for-You" desc="Zero added sugar, vegan-friendly, and 0% artificial colors." />
            <Feature title="Beautifully Packaged" desc="A glossy can built for the spotlight—your feed will love it." />
          </div>
        </div>
      </section>

      {/* Story / Ingredients */}
      <section className="py-16 bg-white/5" id="story">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6">
            <div className="p-6 rounded-2xl bg-white/10 ring-1 ring-white/15 shadow">
              <h3 className="text-xl sm:text-2xl font-semibold">From desert dates to a modern cola</h3>
              <p className="mt-3 text-white/90">
                We source naturally sweet dates known for their rich, caramel flavor and blend them with a crisp cola base. The result: a distinctive, smooth profile that's refreshing and satisfying.
              </p>
              <ul className="mt-4 space-y-2 text-white/90 list-disc pl-5">
                <li>Premium dates, thoughtfully processed</li>
                <li>Balanced fizz for maximum refreshment</li>
                <li>Zero added sugar — sweetness from dates only</li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-6">
            <Card title="Tasting Notes" lines={["Caramel", "Light spice", "Citrus finish"]} />
            <Card title="Pairs With" lines={["Grilled foods", "Movie nights", "Beach sunsets"]} />
          </div>
        </div>
      </section>

      {/* Social proof / Testimonials */}
      <section className="py-16" id="love">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Loved by first sips</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Testimonial quote="Surprisingly smooth—date sweetness just works." name="Aarav" tag="Food Blogger" />
            <Testimonial quote="Crisp, clean, and not overly sweet. I'm in." name="Mira" tag="Designer" />
            <Testimonial quote="Finally a cola that feels modern." name="Kabir" tag="Athlete" />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white text-[#244133] p-8 md:p-10 shadow-lg grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-extrabold">Ready to taste the first-ever Date Cola?</h3>
              <p className="mt-2 text-[#244133]/80">Join the launch list and get a special intro offer.</p>
              <form className="mt-4 flex gap-2" onSubmit={(e)=>e.preventDefault()}>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border-0 ring-1 ring-[#244133]/20 px-4 py-3 focus:ring-2 focus:ring-[#244133] outline-none"
                />
                <button className="rounded-2xl bg-[#244133] text-white px-5 py-3 font-semibold hover:opacity-90">Notify Me</button>
              </form>
            </div>
            <div className="md:text-right">
              <a
                id="buy"
                href="#"
                className="inline-block rounded-2xl bg-[#84B393] text-white px-6 py-3 font-semibold shadow hover:shadow-lg"
              >
                Buy a 6‑Pack
              </a>
              <p className="mt-2 text-sm text-[#244133]/70">Ships pan‑India • Recyclable can</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white/5" id="faq">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold">FAQs</h2>
          <div className="mt-8 divide-y divide-white/10 rounded-2xl bg-white/10 ring-1 ring-white/15">
            {[
              {
                q: "Is Milaf Date Cola sugar‑free?",
                a: "It has zero added sugar. Sweetness comes naturally from dates."
              },
              {
                q: "Does it taste like regular cola?",
                a: "Expect a familiar cola profile with rounder caramel notes and a cleaner finish."
              },
              {
                q: "Where do you ship?",
                a: "We currently ship across India. Retail partners coming soon."
              },
              {
                q: "Is it vegan?",
                a: "Yes, it's vegan‑friendly and contains no animal‑derived ingredients."
              }
            ].map((item, i) => (
              <details key={i} className="group p-5">
                <summary className="cursor-pointer list-none font-semibold flex items-center justify-between">
                  {item.q}
                  <span className="ml-4 transition group-open:rotate-45 text-white/70">+</span>
                </summary>
                <p className="mt-3 text-white/90">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Pixel Board (Million Dollar Homepage nod) */}
      <section className="py-16" id="board">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold">Community Board</h2>
            <span className="text-sm text-white/80">Inspired by the Million Dollar Homepage</span>
          </div>
          <p className="mt-2 text-white/85 max-w-3xl">
            Reserve a tiny tile, drop your logo, and be part of our origin story. Early supporters get featured forever.
          </p>

          <div className="mt-6 grid grid-cols-12 gap-1 rounded-2xl p-2 bg-white/10 ring-1 ring-white/15">
            {Array.from({ length: 120 }).map((_, i) => (
              <button
                key={i}
                className="aspect-square w-full rounded-md bg-white/10 hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={`Reserve tile ${i + 1}`}
                onClick={() => alert("Thanks! We'll reach out with tile options.")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold">Milaf</h3>
            <p className="mt-2 text-white/80 max-w-sm">A modern cola that celebrates the natural sweetness of dates.</p>
          </div>
          <div>
            <h4 className="font-semibold">Explore</h4>
            <ul className="mt-2 space-y-2 text-white/80">
              <li><a href="#why" className="hover:underline">Why Milaf</a></li>
              <li><a href="#story" className="hover:underline">Story</a></li>
              <li><a href="#love" className="hover:underline">Love</a></li>
              <li><a href="#faq" className="hover:underline">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Get in Touch</h4>
            <ul className="mt-2 space-y-2 text-white/80">
              <li><a href="mailto:hello@milafcola.com" className="hover:underline">hello@milafcola.com</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">X (Twitter)</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Store Locator</h4>
            <p className="mt-2 text-white/80">Coming soon. Meanwhile, order online for pan‑India delivery.</p>
          </div>
        </div>
        <p className="text-center mt-12 text-white/70 text-sm">© {new Date().getFullYear()} Milaf Beverages. All rights reserved.</p>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-4 left-0 right-0 px-4 sm:px-6 lg:px-8 md:hidden">
        <div className="mx-auto max-w-md rounded-2xl bg-white/90 backdrop-blur text-[#244133] shadow-lg p-3 flex items-center justify-between">
          <span className="font-semibold">Try Milaf Date Cola</span>
          <a href="#buy" className="rounded-xl bg-[#244133] text-white px-4 py-2 font-semibold">Buy</a>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-xl bg-white/10 px-3 py-1 ring-1 ring-white/20">
      {children}
    </span>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-white/85">{desc}</p>
    </div>
  );
}

function Card({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 shadow">
      <h4 className="font-semibold">{title}</h4>
      <ul className="mt-2 space-y-1 text-white/90 list-disc pl-5">
        {lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

function Testimonial({ quote, name, tag }: { quote: string; name: string; tag: string }) {
  return (
    <figure className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 shadow">
      <blockquote className="text-white/95">"{quote}"</blockquote>
      <figcaption className="mt-4 text-sm text-white/80">— {name}, {tag}</figcaption>
    </figure>
  );
}





