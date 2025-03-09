import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock API service
const eventService = {
  getEventByCode: async (code: string) => {
    // This would be an actual API call in a real app
    console.log(`Fetching event with code: ${code}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock response
    if (code === "MIAMI2025" || code === "miami2025") {
      return {
        success: true,
        data: {
          id: "event-123",
          name: "Miami Networking Event",
          date: "March 15, 2025",
          location: "Downtown Miami Convention Center",
          attendees: 42
        }
      };
    } else {
      return {
        success: false,
        error: "Event not found"
      };
    }
  }
};

const Join: React.FC = () => {
  const navigate = useNavigate();
  const [eventCode, setEventCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [eventData, setEventData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventCode.trim()) {
      setError("Please enter an event code");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await eventService.getEventByCode(eventCode);
      
      if (response.success) {
        // Store event data and show confirmation
        setEventData(response.data);
        setShowConfirm(true);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    // Store event data in localStorage
    localStorage.setItem('selectedEvent', JSON.stringify(eventData));
    // Navigate to onboarding page
    navigate('/onboarding');
  };

  const handleGoBack = () => {
    // Go back to event code entry
    setShowConfirm(false);
    setEventData(null);
  };

  return (
    <div 
      id="join-event" 
      className="flex flex-col justify-center items-center min-h-screen bg-gray-50"
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Network Syrup</h1>
        </div>

        {!showConfirm ? (
          // Event code entry form
          <div className="mt-6">
            <form id="eventForm" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  id="eventCode" 
                  name="eventCode" 
                  placeholder="Enter Event Code" 
                  className={`w-full px-4 py-3 border ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md focus:outline-none focus:ring-2 transition-colors`}
                  value={eventCode}
                  onChange={(e) => setEventCode(e.target.value)}
                  required 
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Try "MIAMI2025" for a demo
                </p>
              </div>
              <div>
                <button 
                  type="submit" 
                  className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'CHECKING...' : 'SUBMIT'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Event confirmation
          <div className="mt-6 space-y-6">
            <div className="text-center">
              <h1 className="text-xl text-gray-700 font-medium">Is this the correct event?</h1>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h1 className="text-2xl font-bold text-gray-900 text-center">{eventData.name}</h1>
              <div className="mt-4 space-y-2">
                <p className="text-gray-700"><span className="font-medium">Date:</span> {eventData.date}</p>
                <p className="text-gray-700"><span className="font-medium">Location:</span> {eventData.location}</p>
                <p className="text-gray-700"><span className="font-medium">Attendees:</span> {eventData.attendees} registered</p>
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-4">
              <button 
                onClick={handleConfirm}
                className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Yes, Continue &gt;
              </button>
              <button 
                onClick={handleGoBack}
                className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                No, Go Back &lt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Join;



















// import React from 'react';

// const Join: React.FC = () => {
//   return (
//     <div 
//       id="join-event" 
//       className="flex flex-col justify-center items-center min-h-screen bg-gray-50"
//     >
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Network Syrup</h1>
//         </div>

//         <div className="mt-6">
//           <form id="eventForm" action="#" method="post" className="space-y-6">
//             <div>
//               <input 
//                 type="text" 
//                 id="eventCode" 
//                 name="eventCode" 
//                 placeholder="Enter Event Code" 
//                 className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
//                 required 
//               />
//             </div>
//             <div>
//               <button 
//                 type="button" 
//                 className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//               >
//                 SUBMIT
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Join;









// const Join = () => {
//   return (
//     <div id="join-event" className="flex flex-col justify-center items-center min-h-screen h-min">
//       <div className="bg-gray-200">

//         <div className="">
//           <h1 className="">Network Syrup</h1>
//         </div>

//         <div className="">
//           <form id="eventForm" action="#" method="post" className="">
//             <input type="text" id="eventCode" name="eventCode" placeholder="Enter Event Code" className="" required />
//             <button type="button" className="">SUBMIT</button>
//           </form>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default Join








// const Join = () => {
//   return (
//     <div id="join-event" className="morning-bg flex flex-col justify-center items-center min-h-screen h-min">
//       <div className="h-screen flex flex-col justify-center items-center ">

//         <div className="p-4 w-[400px] h-[200px] flex justify-center items-center text-center">
//           <h1 className="bungee-regular text-black text-6xl">Network Syrup</h1>
//         </div>

//         <div className="bg-white extra-round-border light-shadow w-[450px] h-[250px] flex flex-col mt-8">
//           <form id="eventForm" action="#" method="post" className="flex gap-5 flex-col justify-center items-center h-full">
//             <input type="text" id="eventCode" name="eventCode" placeholder="Enter Event Code" className="cabin-sketch-regular p-4 w-[300px] input-1 text-3xl text-center" required />
//             <button type="button" className="p-4 w-[300px] btn-submit-1 cabin-sketch-bold text-4xl">SUBMIT</button>
//           </form>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default Join