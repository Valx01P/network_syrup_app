import React from 'react';
import { useNavigate } from 'react-router-dom';

// Mock event data that would be fetched from API
interface EventData {
  id: string;
  name: string;
  date: string;
  location: string;
  attendees: number;
}

const JoinConfirm: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock event data that would be passed from the Join page or fetched based on event code
  const eventData: EventData = {
    id: "event-123",
    name: "Miami Networking Event",
    date: "March 15, 2025",
    location: "Downtown Miami Convention Center",
    attendees: 42
  };

  // Mock functions to handle navigation
  const handleConfirm = () => {
    // In a real app, you might store the event info in context or local storage
    localStorage.setItem('selectedEvent', JSON.stringify(eventData));
    // Navigate to onboarding page
    navigate('/onboarding');
  };

  const handleGoBack = () => {
    // Go back to join page
    navigate('/');
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
      </div>
    </div>
  );
};

export default JoinConfirm;

// const JoinConfirm = () => {
//   return (
//     <div id="join-event" className="flex flex-col justify-center items-center min-h-screen h-min">
//       <div className="bg-gray-200">

//         <div className="">
//           <h1 className="">Network Syrup</h1>
//         </div>

//         <div className="">
//           <div>
//             <h1>Is this the correct event?</h1>
//           </div>

//           <div>
//             <h1>Miami Networking Event</h1>
//           </div>

//           <div>
//             <h1>Yes, Continue &gt;</h1>
//             <h1>No, Go Back &lt;</h1>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default JoinConfirm