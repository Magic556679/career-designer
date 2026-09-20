import Home from '@/routes/home'
// import { Navigate } from 'react-router-dom'
import Step1 from '@/routes/explore/step-1'

// ToDo: ExploreLayout.tsx
export const PublicRoutes = [
  { path: '/', element: <Home /> },
  // TODO: children
  { path: 'explore/step-1', element: <Step1 /> },
]
