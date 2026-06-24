import { SignIn, SignUp } from '@clerk/clerk-react'

export function Login() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <SignIn        
        signUpUrl="/signup"
        fallbackRedirectUrl="/"
    />
    </div>
  )
}

export function Signup() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <SignUp 
        signInUrl="/login"
        fallbackRedirectUrl="/"
      />
    </div>
  )
}