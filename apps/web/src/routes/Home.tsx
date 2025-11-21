import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, Leaf, Shield, Award } from 'lucide-react';
import { IMAGES, TESTIMONIALS } from '../lib/images';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sectionsRef.current.indexOf(entry.target as HTMLElement);
          if (entry.isIntersecting && index !== -1) {
            setVisibleSections((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.hero.main}
            alt="Ayurvedic wellness"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sage-900/80 via-sage-800/70 to-transparent"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl text-white animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Build Your Daily Vigor
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-sage-50">
              Stacks that support stamina, strength & confidence—rooted in Ayurveda, built for today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="btn-primary inline-flex items-center justify-center gap-2">
                Shop Stacks <ArrowRight size={20} />
              </Link>
              <Link
                to="/learn"
                className="bg-white text-sage-700 px-6 py-3 rounded-lg font-semibold hover:bg-sage-50 transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Floating badges */}
        <div className="absolute bottom-8 right-8 hidden lg:flex gap-4 animate-float">
          <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <CheckCircle className="text-sage-600" size={20} />
            <span className="font-semibold text-sm">100% Natural</span>
          </div>
          <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <Award className="text-turmeric-500" size={20} />
            <span className="font-semibold text-sm">Ayurveda Certified</span>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-8 border-b">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-scale-in">
              <div className="text-sage-600 mb-2 flex justify-center">
                <Leaf size={32} />
              </div>
              <p className="font-semibold text-sage-900">100% Natural</p>
              <p className="text-sm text-gray-600">No Synthetic Additives</p>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '100ms' }}>
              <div className="text-sage-600 mb-2 flex justify-center">
                <Shield size={32} />
              </div>
              <p className="font-semibold text-sage-900">Lab Tested</p>
              <p className="text-sm text-gray-600">Quality Assured</p>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '200ms' }}>
              <div className="text-sage-600 mb-2 flex justify-center">
                <Award size={32} />
              </div>
              <p className="font-semibold text-sage-900">Ayurveda Certified</p>
              <p className="text-sm text-gray-600">Traditional Formulas</p>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '300ms' }}>
              <div className="text-sage-600 mb-2 flex justify-center">
                <Star size={32} />
              </div>
              <p className="font-semibold text-sage-900">5000+ Happy Customers</p>
              <p className="text-sm text-gray-600">4.9★ Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Message */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className={`section-padding bg-ayurveda-gradient transition-all duration-700 ${
          visibleSections.has(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white/80 backdrop-blur rounded-2xl p-8 md:p-12 shadow-soft">
                <div className="text-turmeric-600 font-semibold mb-2">Our Story</div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sage-900">
                  From Our Founder, Sumit
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  I built VigorAyurveda because modern life drains us—stress, poor sleep, processed foods.
                  Ayurveda taught me that vitality isn't a pill; it's a practice.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our stacks combine ancient herbs like Ashwagandha and Shilajit with clean formulations,
                  no fillers. This isn't about quick fixes—it's about building resilience, energy, and
                  confidence from the ground up.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Whether you're tackling low drive, morning sluggishness, or just want to feel powerful
                  again, we're here to support your journey. Let's revive vigor, together.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-px bg-sage-300 flex-1"></div>
                  <span className="text-sage-700 font-semibold">Sumit Kumar</span>
                  <div className="h-px bg-sage-300 flex-1"></div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img
                src={IMAGES.hero.ayurveda}
                alt="Ayurvedic herbs and wellness"
                className="rounded-2xl shadow-2xl w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why VigorAyurveda */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className={`section-padding bg-white transition-all duration-700 ${
          visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-sage-900">
              Why VigorAyurveda?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of ancient wisdom and modern science
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center group">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">🌿</div>
              <h3 className="text-2xl font-bold mb-3 text-sage-900">Ayurvedic Roots</h3>
              <p className="text-gray-600 leading-relaxed">
                Time-tested herbs like Ashwagandha, Shilajit, and Gokshura—backed by modern research
                and traditional Ayurvedic principles.
              </p>
            </div>

            <div className="card p-8 text-center group">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">💪</div>
              <h3 className="text-2xl font-bold mb-3 text-sage-900">Focus on Power</h3>
              <p className="text-gray-600 leading-relaxed">
                Whether it's stamina, drive, or morning energy—we target what matters to you
                with carefully crafted formulations.
              </p>
            </div>

            <div className="card p-8 text-center group">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">✨</div>
              <h3 className="text-2xl font-bold mb-3 text-sage-900">Clean Formulations</h3>
              <p className="text-gray-600 leading-relaxed">
                No fillers, no false promises. Just transparent ingredients and honest benefits
                you can trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className={`section-padding bg-sage-50 transition-all duration-700 ${
          visibleSections.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-sage-900">
              What Our Customers Say
            </h2>
            <div className="flex justify-center items-center gap-2 text-turmeric-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} fill="currentColor" size={24} />
              ))}
              <span className="ml-2 text-gray-700 font-semibold">4.9 out of 5</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-sage-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className="text-turmeric-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className={`section-padding bg-white transition-all duration-700 ${
          visibleSections.has(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-sage-900">
              Join Our Community
            </h2>
            <p className="text-xl text-gray-600">
              Follow us @vigorayurveda for daily wellness inspiration
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.values(IMAGES.lifestyle).map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg group cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Lifestyle ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://instagram.com/vigorayurveda"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              Follow Us on Instagram
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-sage-700 to-sage-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Vigor?
          </h2>
          <p className="text-xl mb-8 text-sage-50 max-w-2xl mx-auto">
            Start your journey to natural wellness with our expertly crafted Ayurvedic stacks
          </p>
          <Link to="/shop" className="bg-white text-sage-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-sage-50 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2">
            Explore Products <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}