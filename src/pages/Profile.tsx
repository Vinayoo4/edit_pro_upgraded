import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { LogOut, Heart, ChefHat, CalendarCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { currentUser, recipes, progress, logout } = useAppStore();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  // Stats calc
  const totalCooked = Object.values(progress).filter(p => (typeof p === 'object' ? p.status : p) === 'cooked').length;
  // Naive plans started count based on planned meals
  const plannedRecipeIds = Object.keys(progress).filter(id => {
      const p = progress[id];
      const status = typeof p === 'object' ? p.status : p;
      return status === 'planned' || status === 'cooked';
  });
  const startedPlansCount = plannedRecipeIds.length > 0 ? Math.ceil(plannedRecipeIds.length / 5) : 0; // rough estimate

  const favRecipes = recipes.filter(r => currentUser.favRecipes.includes(r.id));

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-3xl font-bold">
              {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
              <p className="text-gray-500">{currentUser.email}</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm font-bold">
                  Tier: <span className={currentUser.tier === 'premium' ? 'text-green-600 uppercase' : 'text-gray-600 uppercase'}>{currentUser.tier}</span>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <ChefHat className="w-6 h-6" />
              </div>
              <div>
                  <p className="text-sm font-medium text-gray-500">Meals Cooked</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCooked}</p>
              </div>
          </div>
          <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                  <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                  <p className="text-sm font-medium text-gray-500">Plans Started</p>
                  <p className="text-2xl font-bold text-gray-900">{startedPlansCount}</p>
              </div>
          </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="text-lg font-bold text-gray-800">Favorite Recipes</h2>
          </div>
          {favRecipes.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4 p-6">
                  {favRecipes.map(r => (
                      <Link key={r.id} to={`/recipe/${r.id}`} className="flex items-center gap-4 bg-white p-3 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                          <img src={r.imageUrl} alt={r.title} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                          <div>
                              <h3 className="font-bold text-gray-900 line-clamp-1">{r.title}</h3>
                              <p className="text-xs text-gray-500 capitalize">{r.mealType} • {r.calories} kcal</p>
                          </div>
                      </Link>
                  ))}
              </div>
          ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                  You haven't saved any favorite recipes yet.
              </div>
          )}
      </div>
    </div>
  );
};

export default Profile;
