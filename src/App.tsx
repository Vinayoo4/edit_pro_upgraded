import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PlansList from './pages/PlansList';
import PlanDetail from './pages/PlanDetail';
import RecipeDetail from './pages/RecipeDetail';
import GroceryList from './pages/GroceryList';
import Admin from './pages/Admin';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PlansList />} />
          <Route path="plan/:id" element={<PlanDetail />} />
          <Route path="recipe/:id" element={<RecipeDetail />} />
          <Route path="groceries" element={<GroceryList />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
