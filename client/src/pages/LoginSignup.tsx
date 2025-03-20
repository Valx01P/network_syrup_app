import { useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '../api/axiosApi'

const LoginSignup = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const error = location.state?.error
  
  const handleLinkedInLogin = () => {
    authApi.loginWithLinkedin()
  }
  
  const handleGoogleLogin = () => {
    authApi.loginWithGoogle()
  }
  
  const handleGoBack = () => {
    navigate('/onboarding')
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">LOGIN/REGISTER</h1>
          <h2 className="text-xl text-gray-600">New around here?</h2>
        </div>
                
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="mt-8 space-y-4">
          <button
            onClick={handleLinkedInLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-blue-600 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            <img src="/icons/linkedin.svg" alt="LinkedIn" width="24" height="24" className="h-6 w-6" />
            Create a new account
          </button>
                    
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300 font-medium"
          >
            <img src="/icons/google.svg" alt="Google" width="24" height="24" className="h-6 w-6" />
            Continue with Google
          </button>
        </div>
                
        <div className="pt-6 text-center">
          <button
            onClick={handleGoBack}
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-300 flex items-center justify-center mx-auto"
          >
            &lt; Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup









// import React from 'react';

// const LoginSignup: React.FC = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold tracking-tight text-gray-900">LOGIN/REGISTER</h1>
//           <h2 className="text-xl text-gray-600">New around here?</h2>
//         </div>
        
//         <div className="mt-8 space-y-4">
//           <a 
//             href="https://linkedin.com/in/yourprofile" 
//             target="_blank" 
//             rel="noopener noreferrer"
//             className="w-full"
//           >
//             <button 
//               className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-blue-600 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium"
//             >
//               <img src="/icons/linkedin.svg" alt="LinkedIn" width="24" height="24" className="h-6 w-6" />
//               Create a new account
//             </button>
//           </a>
          
//           <a 
//             href="https://accounts.google.com" 
//             target="_blank" 
//             rel="noopener noreferrer"
//             className="w-full"
//           >
//             <button 
//               className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300 font-medium"
//             >
//               <img src="/icons/google.svg" alt="Google" width="24" height="24" className="h-6 w-6" />
//               Continue as guest
//             </button>
//           </a>
//         </div>
        
//         <div className="pt-6 text-center">
//           <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-300 flex items-center justify-center mx-auto">
//             &lt; Go Back
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginSignup;
















// const OnboardingAuth = () => {

//   return (
//     <div>
//       <div>

//         <div className="header-group">
//           <h1>LOGIN/REGISTER</h1>
//           <h2>New around here?</h2>
//         </div>

//         <div className="button-group">

//           <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
//             <button>
//               <img src="/icons/linkedin.svg" alt="LinkedIn" width="24" height="24" />
//               Create a new account
//             </button>
//           </a>

//           <a href="https://accounts.google.com" target="_blank" rel="noopener noreferrer">
//           <button>
//             <img src="/icons/google.svg" alt="Google" width="24" height="24" />
//             Continue as guest
//           </button>
//           </a>

//         </div>

//         <div className="footer-group"><h1>&lt; Go Back</h1></div>

//       </div>
//     </div>
//   )
// }

// export default OnboardingAuth