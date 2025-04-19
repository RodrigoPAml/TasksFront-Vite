# TasksFront-Vite: Modern Task Management Frontend

TasksFront-Vite is a well-structured React application built with Vite, TypeScript, and modern React patterns. 

This project serves as an excellent starting point for developers looking to build modern React applications with a clean architecture and best practices.

Its a simple system for task managment that uses [this](https://github.com/RodrigoPAml/TasksAPI) back-end in C#.

## Project Overview
This frontend application connects to a TasksAPI backend to provide a complete task management solution. The application features:

- **Clean Architecture:** Organized folder structure separating concerns (components, contexts, services, etc.)
- **Modern React Patterns:** Uses React hooks, context API, and functional components
- **TypeScript Integration:** Full type safety throughout the application
- **No UI Libraries:** Custom-built UI components for complete control over styling and behavior
- **Responsive Design:** Works well across different device sizes
  
## Key Features
- **User Authentication:** Secure login, registration, and password recovery
- **Task Management:** Create, read, update, and delete tasks
- **Task Categorization:** Organize tasks by categories
- **Task Filtering:** Filter tasks by various criteria (name, status, priority, etc.)
- **Task Sorting:** Sort tasks by different properties
- **Status Visualization:** Visual indicators for task status and priority
  
## Technical Implementation
The application uses several modern web development techniques:

- **Context API:** For state management (auth, services, snackbar notifications)
- **React Router:** For navigation between different views
- **React Hook Form:** For form handling and validation
- **Axios:** For API communication
- **JWT Authentication:** For secure user sessions
- **CSS Modules:** For component-scoped styling
- **Tailwind CSS:** For utility-first styling
  
## Project Structure
The codebase follows a clean, modular structure:

- **components/:** Reusable UI components (buttons, modals, tables, etc.)
- **contexts/:** React contexts for state management
- **layouts/:** Page layout components
- **pages/:** Application views/screens
- **router/:** Navigation configuration
- **services/:** API communication layer
- **types/:** TypeScript type definitions
- **utils/:** Helper functions and utilities
  
## Development Environment
The project uses Vite for fast development and optimized production builds, with a comprehensive set of development tools:
- **TypeScript:** For type safety
- **ESLint:** For code quality
- **Environment Variables:** For configuration across different environments

## Running

Install dependencies
```
npm install
```

Run dev mode
```
npm run dev
```

# Screenshots

Here are some screenshots of the system.

## Login

Login is the first page.

![image](https://github.com/user-attachments/assets/9e5021f0-f27e-4ffd-82df-0ce72432ac3a)

## Tasks
The main page after the authentication

![image](https://github.com/user-attachments/assets/2ba7ae83-ca5f-4d60-a3c0-7ce8cfe2381a)
