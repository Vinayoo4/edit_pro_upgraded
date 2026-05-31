import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Recipe, Plan, User } from '../types';
import { Check } from 'lucide-react';
import localforage from 'localforage';

const MOCK_RECIPES: Recipe[] = Array.from({ length: 14 }).map((_, i) => ({
  id: `r${i + 1}`,
  title: `Vegan Recipe ${i + 1}`,
  name: `Vegan Recipe ${i + 1}`,
  description: `A delicious and healthy vegan recipe for meal ${i + 1}.`,
  mealType: ['breakfast', 'lunch', 'dinner', 'snack'][i % 4] as 'breakfast' | 'lunch' | 'dinner' | 'snack',
  prepTime: 10 + (i % 5) * 5,
  cookTime: 15 + (i % 4) * 10,
  servings: 2 + (i % 3),
  calories: 300 + (i * 50),
  tags: ['vegan', 'healthy', i % 2 === 0 ? 'quick' : 'hearty'],
  imageUrl: `https://picsum.photos/seed/vegan${i + 1}/800/600`,
  ingredients: [
    { name: 'Ingredient A', amount: '1 cup', unit: 'cup' },
    { name: 'Ingredient B', amount: '2 tbsp', unit: 'tbsp' },
    { name: 'Ingredient C', amount: '1/2 tsp', unit: 'tsp' },
  ],
  instructions: [
    'Prepare the ingredients by washing and chopping.',
    'Mix the ingredients together in a large bowl.',
    'Cook for the specified time until golden brown.',
    'Serve hot and enjoy your vegan meal!'
  ]
}));

MOCK_RECIPES[0].title = 'Creamy Vegan Pasta';
MOCK_RECIPES[0].mealType = 'dinner';
MOCK_RECIPES[1].title = 'Chickpea Salad Wrap';
MOCK_RECIPES[1].mealType = 'lunch';
MOCK_RECIPES[2].title = 'Lentil Shepard\'s Pie';
MOCK_RECIPES[2].mealType = 'dinner';
MOCK_RECIPES[3].title = 'Vegan Pancakes';
MOCK_RECIPES[3].mealType = 'breakfast';

const MOCK_PLANS: Plan[] = [
  {
    id: 'p1',
    weekLabel: 'Week 1',
    title: 'Week 1: Quick & Easy',
    description: 'Simple vegan meals to start your journey off right.',
    tier: 'basic',
    recipeIds: ['r1', 'r2', 'r5', 'r6', 'r7']
  },
  {
    id: 'p2',
    weekLabel: 'Week 2',
    title: 'Week 2: Hearty Comforts',
    description: 'Cozy and filling meals for cold days.',
    tier: 'premium',
    recipeIds: ['r3', 'r4', 'r8', 'r9', 'r10']
  },
  {
    id: 'p3',
    weekLabel: 'Week 3',
    title: 'Week 3: Fresh & Raw',
    description: 'Focus on fresh, raw ingredients and salads.',
    tier: 'basic',
    recipeIds: ['r11', 'r12', 'r13', 'r14', 'r1']
  },
  {
    id: 'p4',
    weekLabel: 'Week 4',
    title: 'Week 4: High Protein',
    description: 'Protein-packed vegan meals for active lifestyles.',
    tier: 'premium',
    recipeIds: ['r2', 'r3', 'r5', 'r8', 'r14']
  }
];

const Admin: React.FC = () => {
  const { seedData, plans, recipes, users } = useAppStore();
  const [seeded, setSeeded] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans'|'recipes'|'members'|'settings'>('settings');
  const [isSeededFlag, setIsSeededFlag] = useState(false);

  // Forms state
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);

  useEffect(() => {
    localforage.getItem('app_seeded').then(val => {
      if (val) setIsSeededFlag(true);
    });
  }, []);

  const handleSeed = async () => {
    const alreadySeeded = await localforage.getItem('app_seeded');
    if (alreadySeeded) {
      alert('Data is already seeded!');
      return;
    }

    seedData(MOCK_PLANS, MOCK_RECIPES, users);
    await localforage.setItem('app_seeded', true);
    setIsSeededFlag(true);
    setSeeded(true);
    setTimeout(() => setSeeded(false), 3000);
  };

  const handleResetSeed = async () => {
    await localforage.removeItem('app_seeded');
    setIsSeededFlag(false);
    seedData([], [], users);
  };

  const handleToggleTier = (user: User) => {
    const newTier = user.tier === 'basic' ? 'premium' : 'basic';
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, tier: newTier } as User : u);
    useAppStore.setState({ users: updatedUsers });
    // if toggling current user
    const state = useAppStore.getState();
    if (state.currentUser?.id === user.id) {
        useAppStore.setState({ currentUser: { ...state.currentUser, tier: newTier } as User});
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="flex gap-4 border-b">
        {(['plans', 'recipes', 'members', 'settings'] as const).map(tab => (
          <button
            key={tab}
            className={`py-2 px-4 capitalize font-medium ${activeTab === tab ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 border rounded-xl shadow-sm">
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Settings & Data Management</h2>
            <p className="text-sm text-gray-600 mb-6">
              Status: {isSeededFlag ? <span className="text-green-600 font-bold">Seeded</span> : <span className="text-yellow-600 font-bold">Not Seeded</span>}
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleSeed}
                disabled={isSeededFlag}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {seeded ? <Check className="w-5 h-5" /> : null}
                {seeded ? 'Seeded Successfully!' : 'Seed Sample Data'}
              </button>

              <button
                onClick={handleResetSeed}
                className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Reset Seed Flag & Clear Data
              </button>
            </div>

            <div className="mt-6 pt-6 border-t text-sm text-gray-500">
                <p className="font-bold">App Information:</p>
                <p>Name: Vegan Meal Planning Hub</p>
                <p>Version: 1.0.0</p>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Weekly Plans</h2>
                <button onClick={() => setShowPlanForm(!showPlanForm)} className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded font-medium text-sm">
                    {showPlanForm ? 'Cancel' : 'Add New Plan'}
                </button>
            </div>

            {showPlanForm && (
                <div className="bg-gray-50 p-4 rounded-lg border mb-6 space-y-4">
                    <h3 className="font-bold">Create Plan</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Title" className="border p-2 rounded" />
                        <input placeholder="Week Label (e.g. Week 1)" className="border p-2 rounded" />
                        <select className="border p-2 rounded">
                            <option value="basic">Basic</option>
                            <option value="premium">Premium</option>
                        </select>
                        <input placeholder="Description" className="border p-2 rounded" />
                        <select multiple className="border p-2 rounded col-span-2 h-24">
                            {recipes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                        </select>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded font-medium">Save Plan (Mock)</button>
                </div>
            )}

            <ul className="divide-y border rounded-lg">
              {plans.map(p => (
                <li key={p.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold">{p.title} <span className="text-xs font-normal bg-gray-100 px-2 py-1 rounded ml-2">{p.tier}</span></p>
                    <p className="text-sm text-gray-500">{p.recipeIds.length} recipes</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-blue-600 hover:underline">Edit</button>
                    <button className="text-sm text-red-600 hover:underline">Delete</button>
                  </div>
                </li>
              ))}
              {plans.length === 0 && <li className="p-4 text-gray-500 text-sm">No plans found.</li>}
            </ul>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recipes</h2>
                <button onClick={() => setShowRecipeForm(!showRecipeForm)} className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded font-medium text-sm">
                    {showRecipeForm ? 'Cancel' : 'Add New Recipe'}
                </button>
            </div>

            {showRecipeForm && (
                <div className="bg-gray-50 p-4 rounded-lg border mb-6 space-y-4">
                    <h3 className="font-bold">Create Recipe</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Name" className="border p-2 rounded" />
                        <select className="border p-2 rounded">
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                        </select>
                        <input placeholder="Prep Time (min)" type="number" className="border p-2 rounded" />
                        <input placeholder="Cook Time (min)" type="number" className="border p-2 rounded" />
                        <input placeholder="Servings" type="number" className="border p-2 rounded" />
                        <input placeholder="Calories" type="number" className="border p-2 rounded" />
                        <input placeholder="Tags (comma separated)" className="border p-2 rounded col-span-2" />
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded font-medium">Save Recipe (Mock)</button>
                </div>
            )}

            <ul className="divide-y border rounded-lg max-h-96 overflow-y-auto">
              {recipes.map(r => (
                <li key={r.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold">{r.title} <span className="text-xs font-normal bg-gray-100 px-2 py-1 rounded ml-2">{r.mealType}</span></p>
                    <p className="text-sm text-gray-500">{r.calories} kcal</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-blue-600 hover:underline">Edit</button>
                    <button className="text-sm text-red-600 hover:underline">Delete</button>
                  </div>
                </li>
              ))}
              {recipes.length === 0 && <li className="p-4 text-gray-500 text-sm">No recipes found.</li>}
            </ul>
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Members</h2>
            <ul className="divide-y border rounded-lg">
              {users.map(u => (
                <li key={u.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold">{u.email}</p>
                    <p className="text-sm text-gray-500">Tier: {u.tier}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase">{u.tier}</span>
                    <button onClick={() => handleToggleTier(u)} className="text-sm text-blue-600 hover:underline">Toggle Tier</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
