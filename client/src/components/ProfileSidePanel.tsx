import { X, Linkedin, Mail } from 'lucide-react'
import { Attendee } from '../types/attendee'

interface ProfileSidePanelProps {
  attendee: Attendee | null
  isOpen: boolean
  onClose: () => void
}

const ProfileSidePanel = ({ attendee, isOpen, onClose }: ProfileSidePanelProps) => {
  if (!isOpen || !attendee) return null
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background overlay */}
        <div 
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* Side panel */}
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          <div className="pointer-events-auto w-screen max-w-md">
            <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
              {/* Header */}
              <div className="px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Attendee Profile
                  </h2>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              
              {/* Profile content */}
              <div className="space-y-6 px-4 sm:px-6">
                {/* Profile image */}
                <div className="flex flex-col items-center">
                  {attendee.profile_image_url ? (
                    <img
                      src={attendee.profile_image_url}
                      alt={`${attendee.first_name} ${attendee.last_name}`}
                      className="h-32 w-32 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl">
                      {attendee.first_name[0]}{attendee.last_name[0]}
                    </div>
                  )}
                  
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    {attendee.first_name} {attendee.last_name}
                  </h3>
                </div>
                
                {/* Contact details */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Contact
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <a 
                        href={`mailto:${attendee.email}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {attendee.email}
                      </a>
                    </div>
                    
                    {attendee.linkedin_url && (
                      <div className="flex items-center text-gray-700">
                        <Linkedin className="h-5 w-5 text-gray-400 mr-2" />
                        <a 
                          href={attendee.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Introduction */}
                {attendee.intro && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                      Introduction
                    </h4>
                    <p className="text-gray-700 whitespace-pre-line">
                      {attendee.intro}
                    </p>
                  </div>
                )}
                
                {/* Interests */}
                {attendee.interests && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                      Interests
                    </h4>
                    <p className="text-gray-700 whitespace-pre-line">
                      {attendee.interests}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="mt-auto border-t border-gray-200">
                <div className="px-4 py-4 sm:px-6">
                  <button
                    onClick={onClose}
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSidePanel