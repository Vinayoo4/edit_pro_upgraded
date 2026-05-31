import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Flame, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { Recipe } from '../types';

const Dashboard: React.FC = () => {
  const { plans, recipes, progress, currentUser } = useAppStore();

  const activePlan = useMemo(() => {
      if (!currentUser) return null;
      let mostRecentTime = 0;
      let activeP = null;

      plans.forEach(plan => {
          let planLatestTime = 0;
          plan.recipeIds.forEach(id => {
              const p = progress[id];
              if (p && typeof p === 'object' && p.updatedAt) {
                  if (p.updatedAt > planLatestTime) planLatestTime = p.updatedAt;
              }
          });
          if (planLatestTime > mostRecentTime) {
              mostRecentTime = planLatestTime;
              activeP = plan;
          }
      });
      return activeP || plans[0];
  }, [plans, progress, currentUser]);

  const streak = useMemo(() => {
      if (!currentUser) return 0;
      const cookedTimes = Object.values(progress)
          .filter((p) => typeof p === 'object' && p !== null && 'status' in p && p.status === 'cooked')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((p: any) => p.updatedAt)
          .sort((a, b) => b - a);

      if (cookedTimes.length === 0) return 0;

      let currentStreak = 1;
      let lastDate = new Date(cookedTimes[0]).setHours(0,0,0,0);

      for (let i = 1; i < cookedTimes.length; i++) {
          const d = new Date(cookedTimes[i]).setHours(0,0,0,0);
          const diffDays = (lastDate - d) / (1000 * 60 * 60 * 24);
          if (diffDays === 1) {
              currentStreak++;
              lastDate = d;
          } else if (diffDays > 1) {
              break;
          }
      }
      return currentStreak;
  }, [progress, currentUser]);

  const recentActivity = useMemo(() => {
      if (!currentUser) return [];
      return Object.entries(progress)
          .filter(([, p]) => typeof p === 'object' && p.status === 'cooked')
          .map(([id, p]) => {
              const pObj = p as { status: string, updatedAt: number };
              const recipe = recipes.find(r => r.id === id);
              return { recipe, time: pObj.updatedAt };
          })
          .sort((a, b) => b.time - a.time)
          .slice(0, 5)
          .filter(x => x.recipe) as { recipe: Recipe, time: number }[];
  }, [progress, recipes, currentUser]);

  if (!currentUser) return null;

  const activePlanRecipes = activePlan ? recipes.filter(r => activePlan.recipeIds.includes(r.id)) : [];
  const totalActiveMeals = activePlanRecipes.length;
  const cookedActiveMeals = activePlanRecipes.filter(r => {
      const p = progress[r.id];
      return typeof p === 'object' ? p.status === 'cooked' : p === 'cooked';
  }).length;
  const progressPercent = totalActiveMeals > 0 ? Math.round((cookedActiveMeals / totalActiveMeals) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser.name}!</h1>
          <p className="text-gray-500 mt-1">Here is your meal planning overview.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Current Active Plan</h2>
              {activePlan ? (
                  <div>
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded inline-block mb-2">{activePlan.weekLabel}</span>
                              <h3 className="text-xl font-bold">{activePlan.title}</h3>
                          </div>
                          <Link to={`/plan/${activePlan.id}`} className="bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                              Continue Plan
                          </Link>
                      </div>
                      <div className="mt-6">
                          <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium text-gray-600">Weekly Progress</span>
                              <span className="font-bold text-green-600">{cookedActiveMeals} of {totalActiveMeals} meals</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3">
                              <div className="bg-green-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have an active plan right now.</p>
                      <Link to="/" className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-lg font-medium transition-colors">Browse Plans</Link>
                  </div>
              )}
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 flex flex-col justify-center items-center text-center shadow-sm">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
              </div>
              <h3 className="text-4xl font-extrabold text-gray-900 mb-1">{streak}</h3>
              <p className="font-medium text-orange-800">Day Streak</p>
              <p className="text-xs text-orange-600/80 mt-2">Keep cooking to build your streak!</p>
          </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Activity className="w-5 h-5" /> Recent Activity</h2>
          </div>
          {recentActivity.length > 0 ? (
              <ul className="divide-y">
                  {recentActivity.map((activity, i) => (
                      <li key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                              <div className="bg-green-100 p-2 rounded-full">
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                  <p className="font-bold text-gray-900">{activity.recipe.title}</p>
                                  <p className="text-xs text-gray-500 flex items-center gap-2">
                                      <span className="uppercase font-semibold">{activity.recipe.mealType}</span>
                                      <span>•</span>
                                      <span>{new Date(activity.time).toLocaleDateString()}</span>
                                  </p>
                              </div>
                          </div>
                          <Link to={`/recipe/${activity.recipe.id}`} className="text-gray-400 hover:text-green-600">
                              <ChevronRight className="w-5 h-5" />
                          </Link>
                      </li>
                  ))}
              </ul>
          ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                  No recent cooking activity found. Time to start cooking!
              </div>
          )}
      </div>
    </div>
  );
};

export default Dashboard;
// Added to trick typescript compiler if needed
