import { createBrowserRouter } from 'react-router-dom'
import { PublicRoutes } from '@/routes/index'
import NotFound from '@/routes/not-found'

export const router = createBrowserRouter([
  ...PublicRoutes,
  {
    path: '*',
    Component: NotFound,
  },
])
