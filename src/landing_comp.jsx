import { useState, useEffect } from "react"
import axios from "axios"
import { FaFacebook, FaPhone, FaEnvelope } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import { useRef } from 'react';

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

export function Cars({logged}) {
  const [cars, setCars] = useState([]);
  const [featured, setFeat] = useState([]);
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const modalScroll = useRef(null)

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
        <div className="carousel w-full overflow-x-scroll overflow-y-hidden h-[95%] flex items-center justify-start [&::-webkit-scrollbar]:hidden snap-x snap-mandatory px-7.75" ref={scrollRef}>
          {cars?.map((car) => (
            <div
              key={car.car_id}
              className="w-[30%] h-[80%] shrink-0 m-[2.5vh] flex justify-center items-end rounded-2xl overflow-hidden shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] hover:scale-[1.025] transition duration-250 ease-in-out hover:bg-white/75"
              style={{
                backgroundImage: `url(http://localhost/vnm-system1-copy/php/cars/uploads/cars/${car.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="w-full h-[70%] flex items-end bg-linear-to-t from-white to-transparent p-2.5">
                <div className="w-full h-[50%] flex flex-col justify-around items-center">
                  <button
                    className="w-[40%] h-[40%] bg-blue-500 rounded-2xl text-white hover:bg-blue-800 transition duration-100 ease-in-out hover:scale-[1.025]"
                    onClick={()=>setDetails(car)}
                  >
                    View Details
                  </button>
                  <h1 className="text-[4.5vh] font-bold text-black drop-shadow-lg">
                    {car.model}
                  </h1>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' })}
          className="absolute left-4 z-20 px-4 py-2 bg-blue-500/50 hover:bg-blue-500 hover:scale-[1.125] transition-all duration-150 text-white rounded-full group-hover:block"
        >
          ←
        </button>
        
        <button 
          onClick={() => scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' })}
          className="absolute right-4 z-20 px-4 py-2 bg-blue-500/50 hover:bg-blue-500 hover:scale-[1.125] transition-all duration-150 text-white rounded-full group-hover:block"
        >
          →
        </button>
      </section>

      {details && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={()=>setDetails(null)}>
          <div className="w-[65vw] h-[85vh] bg-white rounded-xl shadow-lg flex items-center justify-center">
            <div className="w-[45%] h-full bg-gray-300 relative">
              <div className="h-full w-full flex overflow-x-scroll snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" ref={modalScroll}>
                {details.additional_images?.split(',').map((img, index)=>(
                  <img src={`http://localhost/vnm-system1-copy/php/cars/uploads/cars/${img}`} className="h-full object-cover shrink-0 snap-center"/>
                ))}
              </div>
                <button 
                  onClick={(e) => {e.stopPropagation(); modalScroll.current.scrollBy({ left: -modalScroll.current.offsetWidth, behavior: 'smooth' })}}
                  className="absolute top-[50%] translate-y-[-50%] left-2 z-20 w-fit px-2.5 py-1.5 bg-blue-500/50 hover:bg-blue-500 hover:scale-[1.125] transition-all duration-150 text-white rounded-full group-hover:block"
                >
                  ←
                </button>
                
                <button 
                  onClick={(e) => {e.stopPropagation(); modalScroll.current.scrollBy({ left: modalScroll.current.offsetWidth, behavior: 'smooth' })}}
                  className="absolute top-[50%] translate-y-[-50%] right-2 z-20 w-fit px-2.5 py-1.5  bg-blue-500/50 hover:bg-blue-500 hover:scale-[1.125] transition-all duration-150 text-white rounded-full group-hover:block"
                >
                  →
                </button>
            </div>
            <div className="w-[55%] h-full p-7.5 flex flex-col">
              {logged ? (
                <>
                  <h1 className="text-center text-3xl font-bold w-full ">{details.model}</h1>
                  <p className="text-justify text-base my-7.5">{details.description}</p>
                  <h3 className="font-semibold my-0.75">Fuel Type: {details.fuel_type}</h3>
                  <h3 className="font-semibold my-0.75">Transmission: {details.transmission}</h3>
                  <h3 className="font-semibold my-0.75">Model Year: {details.year}</h3>
                  <h3 className="font-semibold my-0.75">Daily Rate: {details.daily_rate}</h3>
                  <button className="w-[30%] h-[7.5vh] rounded-lg bg-blue-500 text-white mt-auto ml-auto hover:bg-blue-800 transition duration-100 ease-in-out hover:scale-[1.025]" onClick={()=>navigate("/rental", { state: { car: details } })}>
                  Rent
                  </button>
                </>
              ) : 
              (
              <>
              <h1 className="text-center text-3xl font-bold w-full ">{details.model}</h1>
              <p className="text-justify text-base my-7.5">{details.description}</p>
              <h3 className="font-semibold my-0.75">Fuel Type: {details.fuel_type}</h3>
              <h3 className="font-semibold my-0.75">Transmission: {details.transmission}</h3>
              <h3 className="font-semibold my-0.75">Model Year: {details.year}</h3>
              <h3 className="font-semibold my-0.75">Daily Rate: {details.daily_rate}</h3>
              <button className="w-fit h-[7.5vh] p-2.5 rounded-lg bg-blue-500 text-white mt-auto ml-auto hover:bg-blue-800 transition duration-100 ease-in-out hover:scale-[1.025]" onClick={()=>navigate("/login")}>
                Login/Signup to Rent
              </button>
              </>
            )}
            </div>
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