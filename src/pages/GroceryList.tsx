import React, { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ShoppingCart, Check } from 'lucide-react';

const GroceryList: React.FC = () => {
  const { recipes, progress } = useAppStore();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Aggregate ingredients for all recipes marked as "planned"
  const groceryItems = useMemo(() => {
    const plannedRecipeIds = Object.keys(progress).filter(id => progress[id] === 'planned');
    const plannedRecipes = recipes.filter(r => plannedRecipeIds.includes(r.id));

    // Simplistic aggregation by exact name matching
    const itemMap = new Map<string, string[]>();

    plannedRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        const key = ing.name.toLowerCase().trim();
        const amounts = itemMap.get(key) || [];
        itemMap.set(key, [...amounts, ing.amount]);
      });
    });

    return Array.from(itemMap.entries()).map(([name, amounts]) => ({
      name,
      // Just joining amounts, a real app might try to parse and sum units
      amount: amounts.join(' + ')
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [recipes, progress]);

  const toggleCheck = (name: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(name)) {
      newChecked.delete(name);
    } else {
      newChecked.add(name);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="p-3 bg-green-100 text-green-700 rounded-full">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grocery List</h1>
          <p className="text-sm text-gray-500">Combined ingredients from your planned meals</p>
        </div>
      </div>

      {groceryItems.length === 0 ? (
        <div className="bg-gray-50 border border-dashed rounded-xl p-10 text-center">
          <p className="text-gray-500 mb-2">Your grocery list is empty.</p>
          <p className="text-sm text-gray-400">Mark some recipes as 'Planned' to see ingredients here.</p>
        </div>
      ) : (
        <ul className="bg-white border rounded-xl shadow-sm divide-y">
          {groceryItems.map((item, idx) => {
            const isChecked = checkedItems.has(item.name);
            return (
              <li
                key={idx}
                onClick={() => toggleCheck(item.name)}
                className={`p-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50 ${isChecked ? 'bg-gray-50 opacity-60' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                    {isChecked ? <Check className="w-4 h-4 text-white" /> : null}
                  </div>
                  <span className={`font-medium capitalize ${isChecked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {item.name}
                  </span>
                </div>
                <span className={`text-sm ${isChecked ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.amount}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default GroceryList;
