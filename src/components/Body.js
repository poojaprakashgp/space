import React from 'react'
import Login from './Login'
import LaunchList from './LaunchList'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoutes from './ProtectedRoutes';
import ProgressBarContainer from './progressBarContainer.js';

const Body = () => {
    const appRouter = createBrowserRouter([
        {
            path: '/',
            element: <Login />
        },
        {
            path: '/launch',
            element: <ProtectedRoutes><LaunchList /></ProtectedRoutes>
        },
        {
            path: '/progressbar',
            element: <ProgressBarContainer />
        }
    ])
  return (
    <div>
       <RouterProvider router={appRouter} />
    </div>
  )
}

export default Body
