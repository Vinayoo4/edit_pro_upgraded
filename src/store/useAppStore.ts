import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import { User, Plan, Recipe, Progress, MealStatus } from '../types';

interface AppState {
  currentUser: User;
  plans: Plan[];
  recipes: Recipe[];
  progress: Progress;

  // Actions
  toggleMembershipTier: () => void;
  setMealStatus: (recipeId: string, status: MealStatus) => void;
  seedData: (plans: Plan[], recipes: Recipe[]) => void;
}

// Custom storage adapter using localforage
const localforageStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await localforage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

const initialUser: User = {
  id: '1',
  name: 'Test User',
  tier: 'basic',
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: initialUser,
      plans: [],
      recipes: [],
      progress: {},

      toggleMembershipTier: () =>
        set((state) => ({
          currentUser: {
            ...state.currentUser,
            tier: state.currentUser.tier === 'basic' ? 'premium' : 'basic',
          },
        })),

      setMealStatus: (recipeId, status) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [recipeId]: status,
          },
        })),

      seedData: (plans, recipes) =>
        set(() => ({
          plans,
          recipes,
        })),
    }),
    {
      name: 'vegan-meals-storage',
      storage: createJSONStorage(() => localforageStorage),
    }
  )
);
