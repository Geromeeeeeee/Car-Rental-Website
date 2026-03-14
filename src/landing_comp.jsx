import { useState, useEffect } from "react"
import axios from "axios"
import { FaFacebook, FaPhone, FaEnvelope } from "react-icons/fa"

export function Home(){
    return(
        <>
        <main className="flex w-full max-w-[100vw] h-[80vh] overflow-hidden">

            {/* LEFT SIDE */}
            <div className="left w-[50%] h-full p-5 flex flex-col justify-center">

                <div className="flex flex-col justify-start h-full m-5">
                <h3 className="font-bold text-[12vh] text-center">Welcome To <span className="text-blue-500 text-center">MLT</span></h3>
                    <h1 className="font-bold text-[6vh] text-center">A Car Rental Website</h1>
                </div>

                <div className="text-start w-[90%] m-5">
                    <p className="text-[4.5vh] text-center">
                        An accessible and affordable high-quality car rental service. 
                        Choose your ride. Start your journey.
                        See the story the road has to offer
                    </p>
                </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="right w-[50%] h-full relative flex items-center justify-center overflow-hidden">
                {/* layered circular background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,#93c5fd_0%,#bfdbfe_30%,#dbeafe_55%,transparent_70%)]"></div>
                
                {/* extra soft circle */}
                <div className="absolute w-162.5 h-162.5 bg-blue-200 rounded-full -right-50 opacity-40"></div>
                
                {/* car */}
                <img
                src="/src/assets/caru.png"
                alt="Car"
                className="absolute w-[135%] -right-5 bottom-7.5 object-contain drop-shadow-2xl hover:scale-110 transition duration-500"/>
                </div>

        </main>    
        </>
    )
}

export function Cars() {
  const [cars, setCars] = useState([]);
  const [featured, setFeat] = useState([]);
  const [details, setDetails] = useState(false);

  const showDetails = () => {
    setDetails(true);
  };

  useEffect(() => {
    const fetch_results = async () => {
      const results = await axios.get(
        "http://localhost/Car-Rental-Website/back/landing.php"
      );
      setCars(results.data.cars);
      setFeat(results.data.featured);
    };

    fetch_results();
  }, []);

  return (
    <>
      <section className="w-full h-screen flex items-center justify-center">
        <div className="carousel w-full overflow-x-scroll overflow-y-hidden h-[90%] flex items-center justify-start">
          {cars?.map((car) => (
            <div
              key={car.car_id}
              className="w-[30%] h-[80%] shrink-0 m-[2.5vh] flex justify-center items-end rounded-2xl overflow-hidden shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] hover:scale-[1.05] transition duration-250 ease-in-out hover:bg-white/75"
              style={{
                backgroundImage: `url(http://localhost/vnm-system1/php/cars/uploads/cars/${car.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="w-full h-[70%] flex items-end bg-linear-to-t from-white to-transparent p-2.5">
                <div className="w-full h-[50%] flex flex-col justify-around items-center">
                  <h1 className="text-[4.5vh] font-bold text-black drop-shadow-lg">
                    {car.model}
                  </h1>
                  <button
                    className="w-[40%] h-[40%] bg-blue-500 rounded-2xl text-white hover:bg-blue-800 transition duration-100 ease-in-out hover:scale-[1.025]"
                    onClick={showDetails}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {details && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={()=>setDetails(false)}>
          <div className="w-[50vw] h-[50vh] bg-green-400 rounded-xl shadow-lg p-4">
            
          </div>
        </div>
      )}
    </>
  );
}

export function About(){
    return(
        <section className="w-full min-h-[50vh] h-fit flex justify-center items-center p-[5vh]" id="About">
            <div className="w-full h-[75vh] shadow-lg rounded-xl flex flex-col justify-evenly items-center p-[10vh]">
              <hr className="w-[90%]"/>
                <h1 className="text-4xl font-bold mb-6 text-center">
                    About Us
                </h1>

                <p className="text-xl text-center w-[90%] mx-auto mb-6">
                    MLT Car Rental is a platform created to provide a simple,
                    affordable, and accessible car rental experience. Our goal
                    is to help users easily explore vehicles and choose the
                    perfect ride for their journey.
                </p>

                <p className="text-xl text-center w-[90%] mx-auto mb-6">
                    This website is designed with accessibility in mind,
                    supporting clear layouts, readable text, and navigation
                    that can be easily used by people with visual impairments.
                </p>

                {/* Contact Section */}
                <div className="flex justify-center space-x-12 text-lg font-medium">

                    <a 
                    href="https://facebook.com" 
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-3 hover:text-blue-600 transition"
                    >
                        <FaFacebook size={30}/>
                        <span>Facebook</span>
                    </a>

                    <a 
                    href="mailto:mltcarrental@gmail.com"
                    className="flex items-center space-x-3 hover:text-orange-500 transition"
                    >
                        <FaEnvelope size={30}/>
                        <span>MLTcarrental@gmail.com</span>
                    </a>

                    <a 
                    href="tel:+639123456789"
                    className="flex items-center space-x-3 hover:text-green-600 transition"
                    >
                        <FaPhone size={30}/>
                        <span>+63 912 345 6789</span>
                    </a>

                </div>
              <hr className="w-[90%]"/>
            </div>
        </section>
    )
}