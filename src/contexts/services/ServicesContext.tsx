import React, { createContext, useContext } from 'react';
import { AuthService } from '../../services/AuthService';
import { CategoryService } from '../../services/CategoryService';
import { TaskService } from '../../services/TaskService';

interface ServicesContextType {
  authService: typeof AuthService;
  categoryService: typeof CategoryService;
  taskService: typeof TaskService;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const services = {
    authService: AuthService,
    categoryService: CategoryService,
    taskService: TaskService,
  };

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);

  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }

  return context;
};