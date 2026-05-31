import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import { User, Plan, Recipe, Progress, MealStatus } from '../types';

interface AppState {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  plans: Plan[];
  recipes: Recipe[];
  progress: Progress;
  groceryListItems: string[]; // List of ingredients

  // Actions
  login: (user: User) => void;
  logout: () => void;
  toggleMembershipTier: () => void;
  setMealStatus: (recipeId: string, status: MealStatus) => void;
  markMeal: (recipeId: string, status: MealStatus) => void;
  toggleFavorite: (recipeId: string) => void;
  seedData: (plans: Plan[], recipes: Recipe[], users?: User[]) => void;
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

const defaultDemoUser: User = {
  id: 'demo-1',
  name: 'Demo User',
  email: 'demo@example.com',
  password: 'password',
  tier: 'basic',
  favRecipes: [],
  isAdmin: false,
};

const defaultAdminUser: User = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin',
  tier: 'premium',
  favRecipes: [],
  isAdmin: true,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      users: [defaultDemoUser, defaultAdminUser],
      currentUser: defaultDemoUser,
      isAuthenticated: true,
      plans: [],
      recipes: [],
      progress: {},
      groceryListItems: [],

      login: (user) => set({ currentUser: user, isAuthenticated: true }),
      logout: () => set({ currentUser: null, isAuthenticated: false }),

      toggleMembershipTier: () =>
        set((state) => {
          if (!state.currentUser) return state;
          const updatedUser = {
            ...state.currentUser,
            tier: state.currentUser.tier === 'basic' ? 'premium' : 'basic',
          } as User;

          return {
            currentUser: updatedUser,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
          };
        }),

      setMealStatus: (recipeId, status) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [recipeId]: { status, updatedAt: Date.now() },
          },
        })),

      markMeal: (recipeId, status) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [recipeId]: { status, updatedAt: Date.now() },
          },
        })),

      toggleFavorite: (recipeId) =>
        set((state) => {
          if (!state.currentUser) return state;

          const isFav = state.currentUser.favRecipes.includes(recipeId);
          const newFavs = isFav
            ? state.currentUser.favRecipes.filter(id => id !== recipeId)
            : [...state.currentUser.favRecipes, recipeId];

          const updatedUser = { ...state.currentUser, favRecipes: newFavs };
          return {
            currentUser: updatedUser,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
          };
        }),

      seedData: (plans, recipes, users) =>
        set((state) => ({
          plans,
          recipes,
          users: users || state.users,
        })),
    }),
    {
      name: 'vegan-meals-storage',
      storage: createJSONStorage(() => localforageStorage),
    }
  )
);
