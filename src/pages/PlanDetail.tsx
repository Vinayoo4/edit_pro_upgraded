import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Clock, CheckCircle2, Circle, ShoppingCart, Lock } from 'lucide-react';

const PlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { plans, recipes, progress, currentUser, markMeal } = useAppStore();

  const plan = plans.find((p) => p.id === id);

  if (!plan) {
    return <div className="text-center py-20 text-gray-500">Plan not found</div>;
  }

  const isLocked = plan.tier === 'premium' && currentUser?.tier !== 'premium';

  const planRecipes = plan.recipeIds
    .map((recipeId) => recipes.find((r) => r.id === recipeId))
    .filter((r): r is NonNullable<typeof r> => !!r);

  const totalCalories = planRecipes.reduce((sum, r) => sum + r.calories, 0);

  // Calculate progress
  const cookedCount = planRecipes.filter(r => {
      const p = progress[r.id];
      return typeof p === 'object' ? p.status === 'cooked' : p === 'cooked';
  }).length;
  const totalMeals = planRecipes.length;
  const progressPercent = totalMeals > 0 ? Math.round((cookedCount / totalMeals) * 100) : 0;

  // Group recipes by "day" chunking them (naive grouping, assuming 1-3 recipes per day based on size)
  const groupedRecipes: { day: number, recipes: typeof planRecipes }[] = [];
  planRecipes.forEach((recipe, index) => {
      const day = Math.floor(index / 2) + 1; // 2 recipes per day as an example
      const group = groupedRecipes.find(g => g.day === day);
      if (group) {
          group.recipes.push(recipe);
      } else {
          groupedRecipes.push({ day, recipes: [recipe] });
      }
  });

  const handleGenerateGrocery = () => {
      // Mark all as planned first if we want them to show in the grocery list
      planRecipes.forEach(r => {
          const currentP = progress[r.id];
          const status = typeof currentP === 'object' ? currentP.status : currentP;
          if (status !== 'cooked' && status !== 'planned') {
            markMeal(r.id, 'planned');
          }
      });
      navigate(`/groceries`);
  };

  const handleToggleStatus = (e: React.MouseEvent, recipeId: string) => {
      e.preventDefault();
      e.stopPropagation();
      const currentP = progress[recipeId];
      const status = typeof currentP === 'object' ? currentP.status : currentP;

      let nextStatus: 'none' | 'planned' | 'cooked' = 'none';
      if (status === 'none') nextStatus = 'planned';
      else if (status === 'planned') nextStatus = 'cooked';
      else if (status === 'cooked') nextStatus = 'none';

      markMeal(recipeId, nextStatus);
  };

  return (
    <div className="space-y-8 pb-12 relative">
      {isLocked && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl border">
              <Lock className="w-16 h-16 text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Premium Plan</h2>
              <p className="text-gray-600 mb-6 max-w-md text-center">Upgrade to Green Member to unlock this weekly meal plan and all exclusive recipes.</p>
              <Link to="/membership" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-8 py-3 rounded-xl transition-colors shadow">
                  Activate Premium
              </Link>
          </div>
      )}

      <div>
        <Link to="/" className="text-sm text-green-600 hover:underline mb-2 inline-block">&larr; Back to Plans</Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">{plan.weekLabel}</span>
                    {plan.tier === 'premium' && <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">Premium</span>}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{plan.title}</h1>
                <p className="text-gray-500 mt-2">{plan.description}</p>
                <p className="text-sm font-medium text-gray-600 mt-2">Total estimated calories: {totalCalories} kcal</p>
            </div>
            <button onClick={handleGenerateGrocery} className="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap border border-green-200">
                <ShoppingCart className="w-4 h-4" /> Generate Grocery List
            </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-700">Plan Progress</span>
              <span className="text-sm font-medium text-green-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">{cookedCount} of {totalMeals} meals cooked</p>
      </div>

      <div className="space-y-10">
        {groupedRecipes.map((group) => (
            <div key={group.day}>
                <h3 className="text-xl font-bold border-b pb-2 mb-4">Day {group.day}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    {group.recipes.map((recipe) => {
                    const currentP = progress[recipe.id];
                    const status = typeof currentP === 'object' ? currentP.status : (currentP || 'none');

                    return (
                        <Link
                        key={recipe.id}
                        to={`/recipe/${recipe.id}`}
                        className="flex items-center bg-white rounded-xl shadow-sm border p-3 hover:shadow-md transition-all gap-4"
                        >
                            <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden relative">
                                {recipe.imageUrl ? (
                                    <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
                                )}
                            </div>

                            <div className="flex flex-col flex-grow min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{recipe.mealType}</span>
                                    <span className="text-xs font-medium text-gray-500">{recipe.calories} kcal</span>
                                </div>
                                <h4 className="font-bold text-gray-900 truncate">{recipe.title}</h4>
                                <div className="flex items-center text-xs text-gray-500 gap-1 mt-1">
                                    <Clock className="w-3 h-3" /> {recipe.prepTime + recipe.cookTime}m total
                                </div>

                                <div className="mt-3 flex justify-between items-center">
                                    <button
                                        onClick={(e) => handleToggleStatus(e, recipe.id)}
                                        className={`text-xs px-2 py-1 rounded font-medium flex items-center gap-1 transition-colors ${
                                            status === 'cooked' ? 'bg-green-100 text-green-700' :
                                            status === 'planned' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {status === 'cooked' ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                                        {status === 'cooked' ? 'Cooked' : status === 'planned' ? 'Planned' : 'Mark Plan'}
                                    </button>
                                    <span className="text-xs text-green-600 font-medium hover:underline">View &rarr;</span>
                                </div>
                            </div>
                        </Link>
                    );
                    })}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default PlanDetail;
