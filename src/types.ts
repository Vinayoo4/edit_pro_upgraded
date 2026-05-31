export type MembershipTier = 'basic' | 'premium';

export interface User {
  id: string;
  name: string;
  email?: string;
  password?: string; // Simulated auth
  tier: MembershipTier;
  favRecipes: string[];
  isAdmin: boolean;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

export interface Recipe {
  id: string;
  title: string;
  name?: string; // alias for title/name
  description: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  calories: number;
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
  imageUrl: string;
}

export interface Plan {
  id: string;
  weekStart?: string; // ISO date string
  weekLabel: string;
  title: string;
  description: string;
  tier: MembershipTier;
  recipeIds: string[];
}

export type MealStatus = 'none' | 'planned' | 'cooked';

export interface ProgressMarker {
  status: MealStatus;
  updatedAt: number;
}

export interface Progress {
  [recipeId: string]: ProgressMarker | MealStatus; // Keeping union for compatibility if needed during migration, though we'll update everything
}
