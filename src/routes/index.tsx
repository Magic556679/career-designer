import Home from '@/routes/home'
// import { Navigate } from 'react-router-dom'
import Step1 from '@/routes/explore/step-1'
import Step2 from '@/routes/explore/step-2'
import ExploreLayout from '@/routes/explore/explore-layout'

export const PublicRoutes = [
  { path: '/', element: <Home /> },
  {
    path: '/explore',
    element: <ExploreLayout />,
    children: [
      { path: 'step-1', element: <Step1 />, handle: { step: 1 } },
      { path: 'step-2', element: <Step2 />, handle: { step: 2 } },
    ],
  },
]
