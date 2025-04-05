import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './Home.tsx'
import Files from './Files.tsx'
import Profile from './Profile.tsx'
import { Error } from './components.tsx'
import { verifyToken } from './utils.ts'

const routes = createBrowserRouter([{
  path: '/',
  element: <App />,
  ErrorBoundary: Error,
  loader: () => {
    // get token from localStorage
    // verify it
    const token = localStorage.getItem('token')
    if (token) verifyToken({ token }).then(authorized => {
      if (!authorized) localStorage.removeItem('token')
    })

  },
  children: [
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/signup',
      element: <Home modal='signup' />,
    },
    {
      path: '/login',
      element: <Home modal='login' />,
    },
    {
      path: '/files',
      element: <Files />
    },
    {
      path: '/profile',
      element: <Profile />
    }

  ]
}])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
)
