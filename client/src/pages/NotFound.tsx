import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div 
      id="not-found" 
      className="bg-gray-100 flex flex-col justify-center items-center min-h-screen"
    >
      <div className="flex flex-col justify-center items-center px-4">
        {/* Question mark box */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm h-48 flex justify-center items-center mb-6">
          <h1 className="text-black text-8xl font-bold">?!?</h1>
        </div>

        {/* Main content box */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl flex flex-col">
          <div className="w-full text-center flex justify-center items-end py-8">
            <h1 className="text-black text-4xl font-semibold">
              The page you are looking<br/>for does not exist :&#40;
            </h1>
          </div>
          
          <div className="w-full flex justify-center items-center py-12">
            <Link to="/">
              <h1 className="text-blue-600 text-3xl font-semibold hover:text-blue-800 transition-colors duration-300">
                Go Home &gt;
              </h1>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

// import { Link } from 'react-router-dom'

// const NotFound = () => {
 
//   return (
//     <div id="not-found" className="not-found-bg flex flex-col justify-center items-center min-h-screen h-min">
//       <div className="h-screen flex flex-col justify-center items-center ">

//         <div className="bg-white p-4 rounded-4xl dark-shadow w-[400px] h-[200px] flex justify-center items-center">
//           <h1 className="bungee-regular text-black text-8xl">?!?</h1>
//         </div>

//         <div className="bg-white p-4 rounded-4xl dark-shadow w-[800px] h-[500px] flex flex-col mt-4">
//           <div className="h-[240px] w-full text-center flex justify-center items-end">
//             <h1 className="cabin-sketch-regular text-black text-4xl">The page you are looking<br/>for does not exist :&#40;</h1>
//           </div>
//           <div className="h-[260px] w-full flex justify-center items-center">
//             <Link to="/">
//               <h1 className="cabin-sketch-regular text-black text-3xl">Go Home &gt;</h1>
//             </Link>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default NotFound