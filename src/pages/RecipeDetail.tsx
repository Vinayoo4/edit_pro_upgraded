import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Clock, ArrowLeft, Check, Plus, Minus } from 'lucide-react';
import { MealStatus } from '../types';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipes, progress, setMealStatus } = useAppStore();

  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const currentStatus = progress[recipe.id] || 'none';

  const handleStatusChange = (status: MealStatus) => {
    // Toggle logic: if clicking the same status, revert to 'none'
    if (currentStatus === status) {
      setMealStatus(recipe.id, 'none');
    } else {
      setMealStatus(recipe.id, status);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-green-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      {recipe.imageUrl && (
        <div className="w-full h-64 md:h-80 bg-gray-200 rounded-xl overflow-hidden shadow-sm">
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">{recipe.title}</h1>
        <p className="text-lg text-gray-500 mt-2">{recipe.description}</p>
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600 font-medium">
          <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"><Clock className="w-4 h-4" /> {recipe.prepTime} mins</span>
        </div>
      </div>

      <div className="flex gap-4 p-4 bg-white border shadow-sm rounded-xl items-center justify-between">
        <span className="font-semibold text-gray-700">Meal Status</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleStatusChange('planned')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              currentStatus === 'planned'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-50 text-gray-600 border hover:bg-gray-100'
            }`}
          >
            {currentStatus === 'planned' ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            Planned
          </button>

          <button
            onClick={() => handleStatusChange('cooked')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              currentStatus === 'cooked'
              ? 'bg-green-500 text-white shadow-sm'
              : 'bg-gray-50 text-gray-600 border hover:bg-gray-100'
            }`}
          >
            <Check className="w-4 h-4" />
            Cooked
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Ingredients</h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-800">{ing.name}</span>
                <span className="text-gray-500">{ing.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Instructions</h2>
          <ol className="space-y-6">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
