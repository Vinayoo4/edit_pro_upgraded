import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Lock, ChevronRight, Play } from 'lucide-react';

const PlansList: React.FC = () => {
  const { plans, currentUser, progress, recipes, markMeal } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'basic' | 'premium'>('all');
  const navigate = useNavigate();

  const filteredPlans = plans.filter(p => filter === 'all' || p.tier === filter);

  const handleStartPlan = (planId: string, recipeIds: string[]) => {
    recipeIds.forEach(id => {
        markMeal(id, 'planned');
    });
    navigate(`/plan/${planId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Plans</h1>
          <p className="text-gray-500 mt-1">Curated vegan meals for your week.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button onClick={() => setFilter('all')} className={`px-4 py-1 text-sm rounded-md transition-colors ${filter === 'all' ? 'bg-white shadow font-medium' : 'text-gray-600'}`}>All</button>
            <button onClick={() => setFilter('basic')} className={`px-4 py-1 text-sm rounded-md transition-colors ${filter === 'basic' ? 'bg-white shadow font-medium' : 'text-gray-600'}`}>Basic</button>
            <button onClick={() => setFilter('premium')} className={`px-4 py-1 text-sm rounded-md transition-colors ${filter === 'premium' ? 'bg-white shadow font-medium' : 'text-gray-600'}`}>Premium</button>
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
          {filteredPlans.map((plan) => {
            const isLocked = plan.tier === 'premium' && currentUser?.tier !== 'premium';

            // Calc stats
            const planRecipes = recipes.filter(r => plan.recipeIds.includes(r.id));
            const totalCals = planRecipes.reduce((sum, r) => sum + r.calories, 0);
            const calsPerDay = Math.round(totalCals / 7);

            // Progress
            const cookedMeals = plan.recipeIds.filter(id => {
                const p = progress[id];
                return typeof p === 'object' ? p.status === 'cooked' : p === 'cooked';
            }).length;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl border p-5 flex flex-col transition-shadow ${
                  isLocked ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded">
                    {plan.weekLabel}
                  </span>
                  {plan.tier === 'premium' && (
                    <span className="flex items-center text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      Premium
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{plan.description}</p>

                <div className="text-xs text-gray-500 mb-4 space-y-1">
                    <p>Recipes: {plan.recipeIds.length}</p>
                    <p>~{calsPerDay} kcal/day</p>
                    <p className="font-medium text-green-700">{cookedMeals} of {plan.recipeIds.length} cooked</p>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  {isLocked ? (
                    <Link to="/membership" className="w-full flex items-center justify-center gap-2 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-lg text-sm font-bold transition-colors">
                      <Lock className="w-4 h-4" /> Upgrade to Unlock
                    </Link>
                  ) : (
                    <>
                      <button onClick={() => handleStartPlan(plan.id, plan.recipeIds)} className="w-full flex items-center justify-center gap-1 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
                          <Play className="w-4 h-4 fill-current" /> Start Plan
                      </button>
                      <Link
                        to={`/plan/${plan.id}`}
                        className="w-full flex items-center justify-center gap-1 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        View Details <ChevronRight className="w-4 h-4" />
                      </Link>
                    </>
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
