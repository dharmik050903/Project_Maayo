import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './pages/App'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/home'
import FreelancerDashboard from './pages/FreelancerDashboard'
import ClientDashboard from './pages/ClientDashboard'
import ProjectCreate from './pages/ProjectCreate'
import FreelancerHome from './pages/FreelancerHome'
import ClientHome from './pages/ClientHome'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/freelancer-dashboard', element: <FreelancerDashboard /> },
      { path: '/client-dashboard', element: <ClientDashboard /> },
      { path: '/create-project', element: <ProjectCreate /> },
      { path: '/freelancer-home', element: <FreelancerHome /> },
      { path: '/client-home', element: <ClientHome /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)


