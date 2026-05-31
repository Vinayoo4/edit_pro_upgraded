import React, { useMemo, useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ShoppingCart, Check, Download, Trash2, Filter } from 'lucide-react';
import localforage from 'localforage';

type Category = 'produce' | 'grains' | 'legumes' | 'dairy-free' | 'spices' | 'other';

interface GroceryItem {
    name: string;
    amount: string;
    category: Category;
}

const GroceryList: React.FC = () => {
  const { recipes, progress } = useAppStore();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [showUncheckedOnly, setShowUncheckedOnly] = useState(false);

  useEffect(() => {
      localforage.getItem<string[]>('grocery_checked_items').then(val => {
          if (val) setCheckedItems(new Set(val));
      });
  }, []);

  const categorizeIngredient = (name: string): Category => {
      const n = name.toLowerCase();
      if (n.includes('pasta') || n.includes('rice') || n.includes('flour') || n.includes('tortilla')) return 'grains';
      if (n.includes('chickpea') || n.includes('lentil') || n.includes('bean')) return 'legumes';
      if (n.includes('milk') || n.includes('cheese') || n.includes('yogurt') || n.includes('nutritional yeast')) return 'dairy-free';
      if (n.includes('salt') || n.includes('pepper') || n.includes('garlic powder') || n.includes('cumin')) return 'spices';
      if (n.includes('potato') || n.includes('carrot') || n.includes('celery') || n.includes('garlic') || n.includes('onion') || n.includes('tomato')) return 'produce';
      return 'other';
  };

  const groceryItemsByCategory = useMemo(() => {
    const plannedRecipeIds = Object.keys(progress).filter(id => {
        const p = progress[id];
        return typeof p === 'object' ? p.status === 'planned' : p === 'planned';
    });

    const plannedRecipes = recipes.filter(r => plannedRecipeIds.includes(r.id));
    const itemMap = new Map<string, string[]>();

    plannedRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        const key = ing.name.toLowerCase().trim();
        const amounts = itemMap.get(key) || [];
        itemMap.set(key, [...amounts, ing.amount]);
      });
    });

    const items: GroceryItem[] = Array.from(itemMap.entries()).map(([name, amounts]) => ({
      name,
      amount: amounts.join(' + '),
      category: categorizeIngredient(name)
    })).sort((a, b) => a.name.localeCompare(b.name));

    const grouped = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, GroceryItem[]>);

    return grouped;
  }, [recipes, progress]);

  const toggleCheck = (name: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(name)) newChecked.delete(name);
    else newChecked.add(name);

    setCheckedItems(newChecked);
    localforage.setItem('grocery_checked_items', Array.from(newChecked));
  };

  const handleClearChecked = () => {
      const newChecked = new Set<string>();
      setCheckedItems(newChecked);
      localforage.setItem('grocery_checked_items', []);
  };

  const handleExport = () => {
      let content = 'VeganHub Grocery List\n\n';

      Object.entries(groceryItemsByCategory).forEach(([category, items]) => {
          content += `== ${category.toUpperCase()} ==\n`;
          items.forEach(item => {
              const mark = checkedItems.has(item.name) ? '[x]' : '[ ]';
              content += `${mark} ${item.name} (${item.amount})\n`;
          });
          content += '\n';
      });

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'veganhub-grocery-list.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const categories = Object.keys(groceryItemsByCategory).sort();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 text-green-700 rounded-full">
                <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Grocery List</h1>
                <p className="text-sm text-gray-500">From your planned meals</p>
            </div>
        </div>

        {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => setShowUncheckedOnly(!showUncheckedOnly)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${showUncheckedOnly ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <Filter className="w-4 h-4" /> {showUncheckedOnly ? 'Show All' : 'Unchecked Only'}
                </button>
                <button onClick={handleClearChecked} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                    <Trash2 className="w-4 h-4" /> Clear Checked
                </button>
                <button onClick={handleExport} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
                    <Download className="w-4 h-4" /> Export
                </button>
            </div>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="bg-gray-50 border border-dashed rounded-xl p-10 text-center">
          <p className="text-gray-500 mb-2">Your grocery list is empty.</p>
          <p className="text-sm text-gray-400">Mark some recipes as 'Planned' to see ingredients here.</p>
        </div>
      ) : (
        <div className="space-y-6">
            {categories.map(category => {
                const items = groceryItemsByCategory[category];
                const visibleItems = showUncheckedOnly ? items.filter(i => !checkedItems.has(i.name)) : items;

                if (visibleItems.length === 0) return null;

                const checkedCount = items.filter(i => checkedItems.has(i.name)).length;

                return (
                    <div key={category} className="bg-white border rounded-xl shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 capitalize">{category}</h3>
                            <span className="text-xs font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                {checkedCount}/{items.length}
                            </span>
                        </div>
                        <ul className="divide-y">
                        {visibleItems.map((item, idx) => {
                            const isChecked = checkedItems.has(item.name);
                            return (
                            <li
                                key={idx}
                                onClick={() => toggleCheck(item.name)}
                                className={`p-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50 ${isChecked ? 'bg-gray-50 opacity-60' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md border ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                    {isChecked && <Check className="w-4 h-4 text-white" />}
                                </div>
                                <span className={`font-medium capitalize ${isChecked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                    {item.name}
                                </span>
                                </div>
                                <span className={`text-sm font-medium ${isChecked ? 'text-gray-400' : 'text-gray-600'}`}>
                                {item.amount}
                                </span>
                            </li>
                            );
                        })}
                        </ul>
                    </div>
                );
            })}
        </div>
      )}
    </div>
  );
};

export default GroceryList;
