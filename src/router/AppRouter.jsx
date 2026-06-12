import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';
import ProtectedRoute from '../auth/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import MainPage from '../pages/MainPage';
import BackofficePage from '../pages/BackofficePage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.MAIN} element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
      <Route path={ROUTES.BACKOFFICE + '/*'} element={<ProtectedRoute><BackofficePage /></ProtectedRoute>} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
