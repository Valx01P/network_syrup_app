import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import CameraFormComponent from "../components/CameraFormComponent";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  intro: string;
  interests: string;
  linkedin: string;
  profileImage: string | null;
}

const OnboardingForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    intro: '',
    interests: '',
    linkedin: '',
    profileImage: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageCapture = (imageDataURL: string) => {
    setFormData({
      ...formData,
      profileImage: imageDataURL
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Log form data to console for testing purposes
    console.log('Form submitted with data:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-8 py-6">
          <h1 className="text-3xl font-bold tracking-tight">ONBOARDING</h1>
          <h2 className="mt-2 text-blue-100">
            To best network with others, fill out the form as best you can!
          </h2>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="LinkedIn Profile URL"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="intro" className="block text-sm font-medium text-gray-700">
                    Brief Introduction
                  </label>
                  <textarea
                    id="intro"
                    name="intro"
                    value={formData.intro}
                    onChange={handleChange}
                    placeholder="Tell us a bit about yourself..."
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
                    Interests
                  </label>
                  <textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="What topics are you interested in discussing?"
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 resize-none"
                  />
                </div>
              </div>
            </div>
            
            {/* Camera component - full width */}
            <div className="mt-8 border-t pt-6">
              <CameraFormComponent onImageCapture={handleImageCapture} />
            </div>

            {/* Footer navigation buttons */}
            <div className="mt-10 pt-6 border-t flex justify-between items-center">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;

// import CameraFormComponent from "../components/CameraFormComponent"

// const OnboardingForm = () => {

//   return (
//     <div>
//       <div>

//         <div className="header-group">
//           <h1>ONBOARDING</h1>
//           <h2>To best network with others, fill out the form as best you can!</h2>
//         </div>

//         <div className="form-group">

//           <form>
//             <input type="text" placeholder="First Name" />
//             <input type="text" placeholder="Last Name" />
//             <input type="text" placeholder="Email" />
//             <textarea placeholder="Intro" />
//             <textarea placeholder="Interests" />
//             <input type="text" placeholder="LinkedIn" />
//             <CameraFormComponent />
//           </form>

//         </div>

//         <div className="footer-group">
//           <h1>&lt; Go Back</h1>
//           <h1>Continue &gt;</h1>
//         </div>

//       </div>
//     </div>
//   )
// }

// export default OnboardingForm