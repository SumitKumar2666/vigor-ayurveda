import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const Home = () => {
  return (
    <div>
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Build Your Daily Vigor
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Stacks that support stamina, strength & confidence—rooted in Ayurveda, built for today.
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90"
          >
            Shop Stacks <ArrowRight />
          </Link>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="bg-amber-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-4">From Our Founder, Sumit</h2>
          <p className="text-gray-700 leading-relaxed">
            I built VigorAyurveda because modern life drains us—stress, poor sleep, processed foods. 
            Ayurveda taught me that vitality isn't a pill; it's a practice. Our stacks combine ancient 
            herbs like Ashwagandha and Shilajit with clean formulations, no fillers. This isn't about 
            quick fixes—it's about building resilience, energy, and confidence from the ground up. 
            Whether you're tackling low drive, morning sluggishness, or just want to feel powerful again, 
            we're here to support your journey. Let's revive vigor, together.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why VigorAyurveda?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold mb-2">Ayurvedic Roots</h3>
              <p className="text-gray-600">
                Time-tested herbs like Ashwagandha, Shilajit, and Gokshura—backed by modern research.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold mb-2">Focus on Power</h3>
              <p className="text-gray-600">
                Whether it's stamina, drive, or morning energy—we target what matters to you.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Clean Formulations</h3>
              <p className="text-gray-600">
                No fillers, no false promises. Just transparent ingredients and honest benefits.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};