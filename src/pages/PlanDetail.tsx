import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Clock, CheckCircle2, Circle } from 'lucide-react';

const PlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { plans, recipes, progress, currentUser } = useAppStore();

  const plan = plans.find((p) => p.id === id);

  if (!plan) {
    return <div>Plan not found</div>;
  }

  // Double check tier access just in case of direct link
  if (plan.tier === 'premium' && currentUser.tier !== 'premium') {
    return <Navigate to="/" replace />;
  }

  const planRecipes = plan.recipeIds
    .map((recipeId) => recipes.find((r) => r.id === recipeId))
    .filter((r): r is NonNullable<typeof r> => !!r);

  return (
    <div className="space-y-8">
      <div>
        <Link to="/" className="text-sm text-green-600 hover:underline mb-2 inline-block">&larr; Back to Plans</Link>
        <h1 className="text-3xl font-bold text-gray-900">{plan.title}</h1>
        <p className="text-gray-500 mt-2">{plan.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {planRecipes.map((recipe) => {
          const status = progress[recipe.id] || 'none';

          return (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              className="flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="h-48 bg-gray-200 overflow-hidden relative">
                {recipe.imageUrl ? (
                  <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
                )}

                {status !== 'none' && (
                  <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1">
                    {status === 'cooked' ? (
                      <><CheckCircle2 className="w-3 h-3 text-green-500" /> <span className="text-green-700">Cooked</span></>
                    ) : (
                      <><Circle className="w-3 h-3 text-blue-500 fill-blue-100" /> <span className="text-blue-700">Planned</span></>
                    )}
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{recipe.description}</p>
                <div className="flex items-center text-sm text-gray-500 gap-1 mt-auto">
                  <Clock className="w-4 h-4" /> {recipe.prepTime} mins
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PlanDetail;
