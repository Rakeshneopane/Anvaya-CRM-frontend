import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'

import './index.css'
import App from './App.jsx'

// const router = createBrowserRouter([
//   {
//     path: "*",
//     element: <App />
//   }
// ])


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

console.log(PUBLISHABLE_KEY);
createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}
    signInUrl="/login"
    signUpUrl="/signup"
    signInFallbackRedirectUrl="/"
    signUpFallbackRedirectUrl="/"
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* <RouterProvider router={router}/> */}
  </ClerkProvider>,
)
