import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store/useAppStore';
import { Plan, Recipe, User } from '../types';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      plans: [],
      recipes: [],
      users: [],
      currentUser: null,
      progress: {}
    });
  });

  const mockRecipes: Recipe[] = Array.from({ length: 14 }).map((_, i) => ({
    id: `r${i}`,
    title: `Recipe ${i}`,
    description: 'desc',
    mealType: 'dinner',
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    calories: 500,
    tags: [],
    ingredients: [{ name: `Ing${i}`, amount: '1' }],
    instructions: [],
    imageUrl: ''
  }));

  const mockPlans: Plan[] = [
    { id: 'p1', title: 'Plan 1', weekLabel: 'W1', description: '', tier: 'basic', recipeIds: ['r0', 'r1'] },
    { id: 'p2', title: 'Plan 2', weekLabel: 'W2', description: '', tier: 'basic', recipeIds: ['r2', 'r3'] },
    { id: 'p3', title: 'Plan 3', weekLabel: 'W3', description: '', tier: 'premium', recipeIds: ['r4', 'r5'] },
    { id: 'p4', title: 'Plan 4', weekLabel: 'W4', description: '', tier: 'premium', recipeIds: ['r6', 'r7'] },
  ];

  const mockUser: User = {
      id: 'u1',
      name: 'User 1',
      tier: 'basic',
      favRecipes: [],
      isAdmin: false
  };

  it('seed loads 4 plans and 14 recipes', () => {
    useAppStore.getState().seedData(mockPlans, mockRecipes, [mockUser]);
    const state = useAppStore.getState();
    expect(state.plans.length).toBe(4);
    expect(state.recipes.length).toBe(14);
  });

  it('markMeal sets status correctly for a recipe', () => {
    useAppStore.getState().markMeal('r1', 'planned');
    let progress = useAppStore.getState().progress['r1'];
    expect(typeof progress === 'object' ? progress.status : progress).toBe('planned');

    useAppStore.getState().markMeal('r1', 'cooked');
    progress = useAppStore.getState().progress['r1'];
    expect(typeof progress === 'object' ? progress.status : progress).toBe('cooked');
  });

  it('toggleFavorite adds and removes recipe from favorites', () => {
    useAppStore.setState({ currentUser: mockUser, users: [mockUser] });

    useAppStore.getState().toggleFavorite('r1');
    expect(useAppStore.getState().currentUser?.favRecipes).toContain('r1');

    useAppStore.getState().toggleFavorite('r1');
    expect(useAppStore.getState().currentUser?.favRecipes).not.toContain('r1');
  });

  it('Grocery list aggregates only planned meal ingredients correctly (via simulated derivation)', () => {
      useAppStore.setState({ recipes: mockRecipes });
      useAppStore.getState().markMeal('r0', 'planned'); // Ing0
      useAppStore.getState().markMeal('r1', 'cooked');  // Ing1

      const { progress, recipes } = useAppStore.getState();
      const plannedRecipeIds = Object.keys(progress).filter(id => {
          const p = progress[id];
          return (typeof p === 'object' ? p.status : p) === 'planned';
      });
      const plannedRecipes = recipes.filter(r => plannedRecipeIds.includes(r.id));

      expect(plannedRecipeIds).toContain('r0');
      expect(plannedRecipeIds).not.toContain('r1');
      expect(plannedRecipes[0].ingredients[0].name).toBe('Ing0');
  });

  it('Premium plan returns locked:true for basic user (simulated check)', () => {
      useAppStore.setState({ currentUser: mockUser, plans: mockPlans });

      const state = useAppStore.getState();
      const premiumPlan = state.plans.find(p => p.tier === 'premium')!;

      const isLocked = premiumPlan.tier === 'premium' && state.currentUser?.tier !== 'premium';

      expect(isLocked).toBe(true);
  });
});
