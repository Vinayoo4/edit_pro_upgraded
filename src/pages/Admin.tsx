import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Recipe, Plan } from '../types';
import { Check } from 'lucide-react';

const MOCK_RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Creamy Vegan Pasta',
    description: 'A rich and creamy pasta dish without any dairy.',
    prepTime: 25,
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800',
    ingredients: [
      { name: 'Pasta', amount: '1 lb' },
      { name: 'Cashews', amount: '1 cup' },
      { name: 'Nutritional Yeast', amount: '2 tbsp' },
      { name: 'Garlic', amount: '2 cloves' }
    ],
    instructions: [
      'Boil pasta according to package directions.',
      'Blend cashews, nutritional yeast, garlic, and 1/2 cup water until smooth.',
      'Drain pasta and mix with the sauce. Heat gently.'
    ]
  },
  {
    id: 'r2',
    title: 'Chickpea Salad Wrap',
    description: 'A quick, protein-packed lunch wrap.',
    prepTime: 10,
    imageUrl: 'https://images.unsplash.com/photo-1528735000313-039ec3a473b0?auto=format&fit=crop&q=80&w=800',
    ingredients: [
      { name: 'Chickpeas', amount: '1 can' },
      { name: 'Vegan Mayo', amount: '2 tbsp' },
      { name: 'Celery', amount: '1 stalk' },
      { name: 'Tortillas', amount: '2 large' }
    ],
    instructions: [
      'Mash chickpeas in a bowl.',
      'Dice celery and mix with chickpeas and vegan mayo.',
      'Spread mixture onto tortillas and wrap tightly.'
    ]
  },
  {
    id: 'r3',
    title: 'Lentil Shepard\'s Pie',
    description: 'A hearty classic, veganized with lentils and a creamy potato topping.',
    prepTime: 45,
    imageUrl: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?auto=format&fit=crop&q=80&w=800',
    ingredients: [
      { name: 'Lentils', amount: '1 cup' },
      { name: 'Potatoes', amount: '3 large' },
      { name: 'Carrots', amount: '2' },
      { name: 'Peas', amount: '1/2 cup' },
      { name: 'Vegetable Broth', amount: '2 cups' }
    ],
    instructions: [
      'Boil potatoes and mash them.',
      'Cook lentils, carrots, and peas in vegetable broth until tender.',
      'Place lentil mix in a baking dish, top with mashed potatoes.',
      'Bake at 400F for 20 minutes.'
    ]
  },
  {
    id: 'r4',
    title: 'Vegan Pancakes',
    description: 'Fluffy weekend breakfast pancakes.',
    prepTime: 15,
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-3221862ce276?auto=format&fit=crop&q=80&w=800',
    ingredients: [
      { name: 'Flour', amount: '1 cup' },
      { name: 'Almond Milk', amount: '1 cup' },
      { name: 'Baking Powder', amount: '1 tbsp' },
      { name: 'Maple Syrup', amount: '2 tbsp' }
    ],
    instructions: [
      'Mix dry ingredients in a bowl.',
      'Whisk in almond milk and maple syrup until just combined.',
      'Cook on a hot greased griddle until bubbles form, then flip.'
    ]
  }
];

const MOCK_PLANS: Plan[] = [
  {
    id: 'p1',
    title: 'Week 1: Quick & Easy',
    description: 'Simple vegan meals to start your journey off right.',
    weekStart: new Date().toISOString(),
    tier: 'basic',
    recipeIds: ['r1', 'r2']
  },
  {
    id: 'p2',
    title: 'Week 2: Hearty Comforts',
    description: 'Cozy and filling meals for cold days.',
    weekStart: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    tier: 'premium',
    recipeIds: ['r3', 'r4', 'r1']
  }
];

const Admin: React.FC = () => {
  const { seedData, plans } = useAppStore();
  const [seeded, setSeeded] = useState(false);

  const handleSeed = () => {
    seedData(MOCK_PLANS, MOCK_RECIPES);
    setSeeded(true);
    setTimeout(() => setSeeded(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-500">Manage your application data here.</p>

      <div className="bg-white p-6 border rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Seed Data</h2>
        <p className="text-sm text-gray-600 mb-6">
          Click the button below to populate the store with sample vegan plans and recipes.
          This will overwrite any existing plans and recipes.
        </p>

        <button
          onClick={handleSeed}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {seeded ? <Check className="w-5 h-5" /> : null}
          {seeded ? 'Seeded Successfully!' : 'Seed Sample Data'}
        </button>

        <div className="mt-6 pt-6 border-t text-sm text-gray-500">
          <p>Current Database Status:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>{plans.length} Weekly Plans</li>
            <li>{plans.filter(p => p.tier === 'premium').length} Premium Plans</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Admin;
