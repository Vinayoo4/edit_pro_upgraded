export type MembershipTier = 'basic' | 'premium';

export interface User {
  id: string;
  name: string;
  tier: MembershipTier;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  imageUrl?: string;
  prepTime: number; // minutes
}

export interface Plan {
  id: string;
  weekStart: string; // ISO date string
  title: string;
  description: string;
  tier: MembershipTier;
  recipeIds: string[];
}

export type MealStatus = 'none' | 'planned' | 'cooked';

export interface Progress {
  [recipeId: string]: MealStatus;
}
