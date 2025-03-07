
const Join = () => {
  return (
    <div id="join-event" className="morning-bg flex flex-col justify-center items-center min-h-screen h-min">
      <div className="h-screen flex flex-col justify-center items-center ">

        <div className="p-4 w-[400px] h-[200px] flex justify-center items-center text-center">
          <h1 className="bungee-regular text-black text-6xl">Network Syrup</h1>
        </div>

        <div className="bg-white extra-round-border light-shadow w-[450px] h-[250px] flex flex-col mt-8">
          <form id="eventForm" action="#" method="post" className="flex gap-5 flex-col justify-center items-center h-full">
            <input type="text" id="eventCode" name="eventCode" placeholder="Enter Event Code" className="cabin-sketch-regular p-4 w-[300px] input-1 text-3xl text-center" required />
            <button type="button" className="p-4 w-[300px] btn-submit-1 cabin-sketch-bold text-4xl">SUBMIT</button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Join