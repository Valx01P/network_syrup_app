

const OnboardingAuth = () => {

  return (
    <div>
      <div>

        <div className="header-group">
          <h1>LOGIN/REGISTER</h1>
          <h2>New around here?</h2>
        </div>

        <div className="button-group">

          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
            <button>
              <img src="/icons/linkedin.svg" alt="LinkedIn" width="24" height="24" />
              Create a new account
            </button>
          </a>

          <a href="https://accounts.google.com" target="_blank" rel="noopener noreferrer">
          <button>
            <img src="/icons/google.svg" alt="Google" width="24" height="24" />
            Continue as guest
          </button>
          </a>

        </div>

        <div className="footer-group"><h1>&lt; Go Back</h1></div>

      </div>
    </div>
  )
}

export default OnboardingAuth