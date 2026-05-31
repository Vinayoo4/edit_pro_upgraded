import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Check, Star } from 'lucide-react';


const Membership: React.FC = () => {
  const { currentUser, toggleMembershipTier } = useAppStore();

  const [showToast, setShowToast] = useState(false);

  if (!currentUser) {
      return <div className="text-center py-20">Please log in to view membership options.</div>;
  }

  const isPremium = currentUser.tier === 'premium';

  const handleActivatePremium = () => {
      if (!isPremium) {
          toggleMembershipTier();
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative pb-12">
      {showToast && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2 z-50">
              <Check className="w-5 h-5" /> Green Member Activated!
          </div>
      )}

      <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">Unlock the full potential of your vegan meal planning journey with our Green Member tier.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className={`bg-white rounded-2xl p-8 border-2 transition-all ${!isPremium ? 'border-gray-900 shadow-xl relative scale-105' : 'border-gray-200'}`}>
              {!isPremium && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">Current Plan</div>}

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
              <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-gray-500 font-medium">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                  <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 flex-shrink-0" /> <span className="text-gray-600">Access to Basic weekly plans</span></li>
                  <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 flex-shrink-0" /> <span className="text-gray-600">Basic recipe viewing</span></li>
                  <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 flex-shrink-0" /> <span className="text-gray-600">Progress tracking</span></li>
              </ul>

              <button
                disabled={!isPremium}
                onClick={toggleMembershipTier}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${!isPremium ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
              >
                  {!isPremium ? 'Active' : 'Downgrade to Free'}
              </button>
          </div>

          {/* Premium Tier */}
          <div className={`bg-green-50 rounded-2xl p-8 border-2 transition-all ${isPremium ? 'border-green-500 shadow-xl relative scale-105' : 'border-green-200'}`}>
              {isPremium && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">Active Plan</div>}

              <div className="flex items-center gap-2 mb-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  <h2 className="text-2xl font-bold text-green-900">Green Member</h2>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-green-900">$4.99</span>
                  <span className="text-green-700 font-medium">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                  <li className="flex gap-3"><Check className="w-5 h-5 text-green-600 flex-shrink-0" /> <span className="text-green-800 font-medium">Unlock all premium plans</span></li>
                  <li className="flex gap-3"><Check className="w-5 h-5 text-green-600 flex-shrink-0" /> <span className="text-green-800 font-medium">Exclusive high-protein & specialty recipes</span></li>
                  <li className="flex gap-3"><Check className="w-5 h-5 text-green-600 flex-shrink-0" /> <span className="text-green-800 font-medium">Advanced grocery list export</span></li>
                  <li className="flex gap-3"><Check className="w-5 h-5 text-green-600 flex-shrink-0" /> <span className="text-green-800 font-medium">Support app development</span></li>
              </ul>

              <button
                onClick={handleActivatePremium}
                disabled={isPremium}
                className={`w-full py-3 rounded-xl font-bold transition-colors shadow-sm ${isPremium ? 'bg-green-600 text-white opacity-80 cursor-default' : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                  {isPremium ? 'Premium Active' : 'Activate Premium'}
              </button>
          </div>
      </div>
    </div>
  );
};

export default Membership;
