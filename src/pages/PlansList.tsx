import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Lock, ChevronRight } from 'lucide-react';

const PlansList: React.FC = () => {
  const { plans, currentUser } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Plans</h1>
          <p className="text-gray-500 mt-1">Curated vegan meals for your week.</p>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
          <p className="text-gray-500 mb-4">No plans available yet.</p>
          <Link to="/admin" className="text-green-600 font-medium hover:underline">
            Go to Admin to seed data
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const isLocked = plan.tier === 'premium' && currentUser.tier !== 'premium';

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl border p-5 transition-shadow ${
                  isLocked ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded">
                    {new Date(plan.weekStart).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  {plan.tier === 'premium' && (
                    <span className="flex items-center text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      Premium
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{plan.description}</p>

                <div className="mt-auto">
                  {isLocked ? (
                    <button disabled className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium">
                      <Lock className="w-4 h-4" /> Locked
                    </button>
                  ) : (
                    <Link
                      to={`/plan/${plan.id}`}
                      className="w-full flex items-center justify-center gap-1 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Plan <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlansList;
