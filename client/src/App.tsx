import { useState, useRef, useEffect } from 'react'
import { Camera, RefreshCw, Check } from 'lucide-react'

interface CameraFormComponentProps {
  onImageCapture?: (imageDataURL: string) => void
}

const CameraFormComponent = ({ onImageCapture }: CameraFormComponentProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Start the camera
  const startCamera = async () => {
    try {
      setCameraError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false
      })
      
      setStream(mediaStream)
      setCameraActive(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraError("Could not access camera. Please check permissions.")
    }
  }

  // Stop the camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setCameraActive(false)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  // Capture an image from the video stream
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (!context) return
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      
      // Draw the current video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Convert canvas to data URL
      try {
        const imageDataURL = canvas.toDataURL('image/png')
        setCapturedImage(imageDataURL)
        
        // Pass the captured image to parent component if callback exists
        if (onImageCapture) {
          onImageCapture(imageDataURL)
        }
      } catch (error) {
        console.error("Error capturing image:", error)
        setCameraError("Failed to capture image. Please try again.")
      }
    }
  }

  // Reset the process to take a new photo
  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  // Confirm the photo selection
  const confirmPhoto = () => {
    // Log confirmation to console for testing
    console.log("Photo confirmed:", capturedImage)
    // Keep the photo but stop the camera stream
    stopCamera()
  }

  // Initialize camera on component mount if needed
  useEffect(() => {
    // Optional: Automatically start camera when component mounts
    // startCamera()
    
    // Clean up on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Make sure video plays when stream is available
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(e => {
        console.error("Error playing video:", e)
        setCameraError("Error displaying camera feed. Please try again.")
      })
    }
  }, [stream])

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center mb-2">
        <Camera className="mr-2 text-blue-600" size={24} />
        <h3 className="text-lg font-medium">Profile Photo</h3>
      </div>

      {/* Camera display area */}
      <div className="flex flex-col items-center space-y-4">
        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden"></canvas>

        {/* Error message if camera fails */}
        {cameraError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm w-full max-w-lg text-center">
            {cameraError}
          </div>
        )}

        {/* Preview area - either shows video feed or captured image */}
        <div className="relative w-64 h-64 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-300">
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Camera size={48} className="text-gray-400" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Circular profile preview */}
        {capturedImage && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2 text-center">Profile Preview</p>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mx-auto">
              <img 
                src={capturedImage} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Camera controls */}
        <div className="flex justify-center space-x-4 mt-4">
          {!cameraActive && !capturedImage && (
            <button
              type="button"
              onClick={startCamera}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
            >
              <Camera size={16} className="mr-2" />
              Start Camera
            </button>
          )}

          {cameraActive && (
            <button
              type="button"
              onClick={captureImage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Take Photo
            </button>
          )}

          {capturedImage && (
            <>
              <button
                type="button"
                onClick={retakePhoto}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition flex items-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Retake
              </button>
              <button
                type="button"
                onClick={confirmPhoto}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
              >
                <Check size={16} className="mr-2" />
                Confirm
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CameraFormComponent

// import { BrowserRouter, Routes, Route } from "react-router-dom"
// import { Suspense, lazy } from 'react'
// // import { AuthProvider } from "./context/AuthContext"
// // import ProtectedRoute from "./components/ProtectedRoute"

// // Lazy load all pages
// const Home = lazy(() => import("./pages/Home"))
// const NotFound = lazy(() => import("./pages/NotFound"))

// // Event Pages
// const Dashboard = lazy(() => import("./pages/Dashboard"))
// const CreateEvent = lazy(() => import("./pages/CreateEvent"))
// const UpdateEvent = lazy(() => import("./pages/UpdateEvent"))

// // Event Participant Pages
// const Join = lazy(() => import("./pages/Join"))
// const Onboarding = lazy(() => import("./pages/Onboarding"))
// const LoginSignup = lazy(() => import("./pages/LoginSignup"))
// const OnboardingForm = lazy(() => import("./pages/OnboardingForm"))
// const EventLobby = lazy(() => import("./pages/EventLobby"))
// const EventNetworking = lazy(() => import("./pages/EventNetworking"))
// const EventEnd = lazy(() => import("./pages/EventEnd"))


// // Event Organizer Pages
// const EventAdminLiveEvent = lazy(() => import("./pages/EventAdminLiveEvent"))
// const EventAdminStatistics = lazy(() => import("./pages/EventAdminStatistics"))

// // const Navbar = lazy(() => import("./components/Navbar"))

// const PageLoader = () => (
//   <div className="flex items-center justify-center h-screen">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//   </div>
// )

// const App = () => {
//   return (
//     <BrowserRouter>
//       {/* <AuthProvider> */}
//         {/* <Navbar /> */}
//         <Suspense fallback={<PageLoader />}>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Join />} />
//             <Route path="/home" element={<Home />} />


//             {/* Protected Routes */}
//             {/* <Route element={<ProtectedRoute requiredRole={["user", "guest"]} />}>
            
//             </Route>

//             <Route element={<ProtectedRoute requiredRole={["user"]} />}>

//             </Route> */}

//             <Route path="/create-event" element={<CreateEvent />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/event-admin/live" element={<EventAdminLiveEvent />} />
//             <Route path="/event-admin/statistics" element={<EventAdminStatistics />} />
//             <Route path="/event/end" element={<EventEnd />} />
//             <Route path="/event/lobby" element={<EventLobby />} />
//             <Route path="/event/networking" element={<EventNetworking />} />
//             <Route path="/onboarding" element={<Onboarding />} />
//             <Route path="/onboarding/auth" element={<LoginSignup />} />
//             <Route path="/onboarding/form" element={<OnboardingForm />} />
//             <Route path="/update-event" element={<UpdateEvent />} />
            
//             {/* 404 Route */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </Suspense>
//       {/* </AuthProvider> */}
//     </BrowserRouter>
//   )
// }

// export default App