import { Link } from 'react-router-dom'

const NotFound = () => {
 
  return (
    <div id="not-found" className="not-found-bg flex flex-col justify-center items-center min-h-screen h-min">
      <div className="h-screen flex flex-col justify-center items-center ">

        <div className="bg-white p-4 rounded-4xl dark-shadow w-[400px] h-[200px] flex justify-center items-center">
          <h1 className="bungee-regular text-black text-8xl">?!?</h1>
        </div>

        <div className="bg-white p-4 rounded-4xl dark-shadow w-[800px] h-[500px] flex flex-col mt-4">
          <div className="h-[240px] w-full text-center flex justify-center items-end">
            <h1 className="cabin-sketch-regular text-black text-4xl">The page you are looking<br/>for does not exist :&#40;</h1>
          </div>
          <div className="h-[260px] w-full flex justify-center items-center">
            <Link to="/">
              <h1 className="cabin-sketch-regular text-black text-3xl">Go Home &gt;</h1>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default NotFound