import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from '../contexts/snackbar/SnackbarContext';
import { ServiceProvider } from '../contexts/services/ServicesContext';
import { AuthProvider } from '../contexts/auth/AuthContext';
import Layout from '../layouts/default/Layout';
import Tasks from '../pages/tasks/page/Tasks';
import Login from '../pages/login/Login';
import SignUp from '../pages/sign-up/SignUp';
import ForgotPassword from '../pages/forgot-password/ForgotPassword';
import NotFound from '../pages/not-found/NotFound';
import Categories from '../pages/categories/page/Categories';

function Router() {
  return (
    <ServiceProvider>
      <SnackbarProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="sign-up" element={<SignUp />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="categories" element={<Categories />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SnackbarProvider>
    </ServiceProvider>
  );
}

export default Router;