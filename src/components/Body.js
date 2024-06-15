import React from 'react'
import Login from './Login'
import LaunchList from './LaunchList'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes'

const Body = () => {

    const appRouter = createBrowserRouter([
        {
            path: '/',
            element: <Login />
        },
        {
            path: '/launch',
            element: <ProtectedRoutes><LaunchList /></ProtectedRoutes>
        }
    ])
  return (
    <div>
       <RouterProvider router={appRouter} />
    </div>
  )
}

export default Body