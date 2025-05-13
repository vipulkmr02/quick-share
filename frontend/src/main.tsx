import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './Home.tsx'
import Files from './Files.tsx'
import Profile from './Profile.tsx'
import { Error } from './components.tsx'
import { fetchUserInfo, verifyToken } from './utils.ts'
import { toast } from 'react-toastify'

const routes = createBrowserRouter([{
  path: '/',
  element: <App />,
  ErrorBoundary: Error,
  loader: () => {
    // checking if the API is up or not
    let apiToast = false;
    let profileToast = false;
    fetch('http://localhost:8000/').then(res => {
      if (res.status != 200) {
        if (!apiToast) {
          apiToast = true;
          toast.error('API is down. Please try again later.')
        }
      }
    }).catch(() => {
      if (!apiToast) {
        apiToast = true;
        toast.error('API is down. Please try again later.')
      }
    })

    const token = localStorage.getItem('token')
    if (token) {
      verifyToken({ token }).then(authorized => {
        if (!authorized) localStorage.removeItem('token')
        else {
          fetchUserInfo({ token }).then((res) => {
            if (res.ok) return res.json();
            else {
              throw 'Invalid token';
            }
          }).then(json => {
            if (json.profile === null) {
              if (localStorage.getItem('user-info'))
                localStorage.removeItem('user-info')
              if (!profileToast) {
                profileToast = true;
                toast.error('Please fill all your details.')
                if (window.location.pathname !== '/profile') window.location.replace('/profile')
              }
            } else {
              localStorage.setItem('user-info', JSON.stringify(json))
            }
          })
        }
      })
    }
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
    },
    {
      path: '/logout',
      loader: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user-info')
        toast.success('Logged out successfully.')
        window.location.replace('/')
      }
    }

  ]
}])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
)
