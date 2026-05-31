import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Clock, ArrowLeft, Check, Plus, Minus, Heart, Flame, Users, WifiOff, ShoppingCart } from 'lucide-react';
import {} from '../types';
import localforage from 'localforage';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipes, progress, markMeal, currentUser, toggleFavorite } = useAppStore();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
      };
  }, []);

  useEffect(() => {
      if (id) {
          localforage.getItem<number[]>(`ingredients_check_${id}`).then(val => {
              if (val) setCheckedIngredients(new Set(val));
          });
      }
  }, [id]);

  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return <div className="text-center py-20 text-gray-500">Recipe not found</div>;
  }

  const currentP = progress[recipe.id];
  const currentStatus = typeof currentP === 'object' ? currentP.status : (currentP || 'none');

  const handleStatusChange = () => {
    let nextStatus: 'none' | 'planned' | 'cooked' = 'none';
    if (currentStatus === 'none') nextStatus = 'planned';
    else if (currentStatus === 'planned') nextStatus = 'cooked';
    else if (currentStatus === 'cooked') nextStatus = 'none';
    markMeal(recipe.id, nextStatus);
  };

  const toggleIngredient = (idx: number) => {
      const newSet = new Set(checkedIngredients);
      if (newSet.has(idx)) newSet.delete(idx);
      else newSet.add(idx);
      setCheckedIngredients(newSet);
      localforage.setItem(`ingredients_check_${id}`, Array.from(newSet));
  };

  const toggleStep = (idx: number) => {
      const newSet = new Set(checkedSteps);
      if (newSet.has(idx)) newSet.delete(idx);
      else newSet.add(idx);
      setCheckedSteps(newSet);
  };

  const handleAddToGrocery = () => {
      // Simplistic global grocery addition just marking as planned for now
      // The GroceryList aggregates from planned meals.
      if (currentStatus !== 'planned' && currentStatus !== 'cooked') {
          markMeal(recipe.id, 'planned');
      }
      alert('Ingredients added to your grocery list (Recipe marked as planned)');
  };

  const isFavorite = currentUser?.favRecipes.includes(recipe.id);
  const relatedRecipes = recipes.filter(r => r.mealType === recipe.mealType && r.id !== recipe.id).slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-green-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        {isOffline && (
            <span className="flex items-center gap-1 text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                <WifiOff className="w-3 h-3" /> Offline Mode
            </span>
        )}
      </div>

      <div className="relative w-full h-64 md:h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
        )}
        <button onClick={() => toggleFavorite(recipe.id)} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-50 transition-colors">
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">{recipe.title}</h1>
        <p className="text-lg text-gray-500 mt-2">{recipe.description}</p>

        <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-700 font-medium">
          <span className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg"><Clock className="w-4 h-4 text-blue-500" /> Prep: {recipe.prepTime}m | Cook: {recipe.cookTime}m</span>
          <span className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg"><Users className="w-4 h-4 text-purple-500" /> {recipe.servings} Servings</span>
          <span className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg"><Flame className="w-4 h-4 text-red-500" /> {recipe.calories} kcal</span>
          <div className="flex gap-1 ml-2">
            {recipe.tags.map(tag => (
                <span key={tag} className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border shadow-sm rounded-xl items-center justify-between">
        <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">Status:</span>
            <button
                onClick={handleStatusChange}
                className={`px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors min-w-[160px] ${
                currentStatus === 'cooked'
                ? 'bg-green-500 text-white shadow-sm'
                : currentStatus === 'planned'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
                {currentStatus === 'cooked' ? <Check className="w-5 h-5" /> : currentStatus === 'planned' ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {currentStatus === 'cooked' ? 'Marked as Cooked' : currentStatus === 'planned' ? 'Marked as Planned' : 'Unmarked'}
            </button>
        </div>

        <button onClick={handleAddToGrocery} className="text-sm font-bold text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Add to Grocery List
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Ingredients</h2>
          <ul className="space-y-1">
            {recipe.ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients.has(idx);
                return (
                    <li key={idx} onClick={() => toggleIngredient(idx)} className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors hover:bg-gray-50 ${isChecked ? 'opacity-50' : ''}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                            {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className={`text-sm flex justify-between flex-grow ${isChecked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            <span className="font-medium">{ing.name}</span>
                            <span className="text-gray-500 ml-2">{ing.amount} {ing.unit || ''}</span>
                        </div>
                    </li>
                );
            })}
          </ul>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((step, idx) => {
                const isChecked = checkedSteps.has(idx);
                return (
                    <li key={idx} className={`flex gap-4 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-gray-50 border-gray-100' : 'bg-white hover:border-green-200 shadow-sm'}`} onClick={() => toggleStep(idx)}>
                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isChecked ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                        {idx + 1}
                        </span>
                        <p className={`text-gray-700 leading-relaxed pt-1 select-none ${isChecked ? 'line-through text-gray-400' : ''}`}>{step}</p>
                    </li>
                );
            })}
          </ol>
        </div>
      </div>

      {relatedRecipes.length > 0 && (
          <div className="pt-8 mt-8 border-t">
              <h2 className="text-xl font-bold mb-4">You might also like</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                  {relatedRecipes.map(r => (
                      <Link key={r.id} to={`/recipe/${r.id}`} className="flex items-center gap-4 bg-white p-3 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                          <img src={r.imageUrl} alt={r.title} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                          <div>
                              <h3 className="font-bold text-gray-900">{r.title}</h3>
                              <p className="text-xs text-gray-500 capitalize">{r.mealType} • {r.calories} kcal</p>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default RecipeDetail;
