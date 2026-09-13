import { createBrowserRouter } from 'react-router-dom'
import { PublicRoutes } from '@/routes/index'
import Notfound from '@/routes/not-found'

export const router = createBrowserRouter([
  ...PublicRoutes,
  {
    path: '*',
    Component: Notfound,
  },
])
