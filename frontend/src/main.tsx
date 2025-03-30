import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './Home.tsx'
import Files from './Files.tsx'
import Profile from './Profile.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

const routes = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [
    {
      path: '/',
      element: <Home />
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
