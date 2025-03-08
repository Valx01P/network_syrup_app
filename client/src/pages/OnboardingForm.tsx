import CameraFormComponent from "../components/CameraFormComponent"

const OnboardingForm = () => {

  return (
    <div>
      <div>

        <div className="header-group">
          <h1>ONBOARDING</h1>
          <h2>To best network with others, fill out the form as best you can!</h2>
        </div>

        <div className="form-group">

          <form>
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
            <input type="text" placeholder="Email" />
            <textarea placeholder="Intro" />
            <textarea placeholder="Interests" />
            <input type="text" placeholder="LinkedIn" />
            <CameraFormComponent />
          </form>

        </div>

        <div className="footer-group">
          <h1>&lt; Go Back</h1>
          <h1>Continue &gt;</h1>
        </div>

      </div>
    </div>
  )
}

export default OnboardingForm