import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { authApi } from '../api/axiosApi'

const Onboarding = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isGuest, setGuest } = useAuthStore()
  
  // Check if we already have event data
  useEffect(() => {
    const eventData = localStorage.getItem('selectedEvent')
    
    if (!eventData) {
      // No event data, redirect back to join page
      navigate('/')
    }
    
    // If user is already authenticated, go directly to form
    if (isAuthenticated) {
      navigate('/onboarding/form')
    }
  }, [navigate, isAuthenticated])
  
  const handleCreateAccount = () => {
    // Redirect to login/signup page
    navigate('/onboarding/auth')
  }
  
  const handleContinueAsGuest = () => {
    // Set guest mode in auth store
    setGuest(true)
    
    // Navigate to onboarding form
    navigate('/onboarding/form')
  }
  
  const handleGoBack = () => {
    // Go back to join page
    navigate('/')
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">HI!</h1>
          <h2 className="text-lg text-gray-600 px-2">
            Hey there, welcome to network syrup, let&apos;s get you setup for your networking session!!
          </h2>
        </div>
                
        <div className="mt-8 space-y-4">
          <button
            onClick={handleCreateAccount}
            className="w-full flex items-center justify-center px-4 py-3 border border-blue-600 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            Create a new account
          </button>
                    
          <button
            onClick={handleContinueAsGuest}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300 font-medium"
          >
            Continue as guest
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

export default Onboarding







// import React from 'react';

// const Onboarding: React.FC = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
//         <div className="text-center space-y-4">
//           <h1 className="text-4xl font-bold tracking-tight text-gray-900">HI!</h1>
//           <h2 className="text-lg text-gray-600 px-2">
//             Hey there, welcome to network syrup, let&apos;s get you setup for your networking session!!
//           </h2>
//         </div>
        
//         <div className="mt-8 space-y-4">
//           <button 
//             className="w-full flex items-center justify-center px-4 py-3 border border-blue-600 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium"
//           >
//             Create a new account
//           </button>
          
//           <button 
//             className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300 font-medium"
//           >
//             Continue as guest
//           </button>
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

// export default Onboarding;






















// const Onboarding = () => {

//   return (
//     <div>
//       <div>
//         <div className="header-group">
//           <h1>HI!</h1>
//           <h2>Hey there, welcome to network syrup, let&apos;s get you setup for your networking session!!</h2>
//         </div>

//         <div className="button-group">
//           <button>Create a new account</button>
//           <button>Continue as guest</button>
//         </div>

//         <div className="footer-group"><h1>&lt; Go Back</h1></div>
//       </div>
//     </div>
//   )
// }

// export default Onboarding