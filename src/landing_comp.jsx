import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { FaFacebook, FaPhone, FaEnvelope } from "react-icons/fa"

export function Nav({navDisplay}){
    const navigate = useNavigate()

    return(
        <>
        {navDisplay ? (
            <nav className="w-full h-[12.5vh] flex justify-between items-center p-5 ">
            <div className="h-full w-[50%] flex items-center">
                <img src="/src/assets/MLT_logo.png" alt="Logo" className="h-[200%] aspect-square"/>
                <div className="flex space-x-6 ml-10">
                    <a href="#" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Home</a>
                    <a href="#About" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">About</a>
                    <a href="#" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Cars</a>
                </div>
            </div>
            
            <div className="log-in w-fit h-full">
                <button 
                className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-black text-white font-bold rounded-lg text-l hover:scale-[1.075]" 
                onClick={()=>navigate("/login")}>
                Login/Signup
                </button>
            </div>
        </nav>
        ) : (
            null
        )}
        </>
    )
}

export function Home(){
    return(
        <>
        <main className="flex w-full max-w-[100vw] h-[80vh] overflow-hidden">

            {/* LEFT SIDE */}
            <div className="left w-[50%] h-full p-5 flex flex-col justify-center">

                <div className="flex flex-col justify-start h-full m-5">
                    <h3 className="font-bold text-[12vh]">Welcome To MLT</h3>
                    <h1 className="font-bold text-[6vh]">A Car Rental Website</h1>
                </div>

                <div className="text-start w-[90%] m-5">
                    <p className="text-[4.5vh]">
                        An accessible and affordable high-quality car rental service. 
                        Choose your ride. Start your journey.
                        See the story the road has to offer
                    </p>
                </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="right w-[50%] h-full relative flex items-center justify-center">

                {/* Circle Background */}
                <div className="[clip-path:circle(50%_at_80%_50%)] bg-gray-300 h-full w-full"></div>

                {/* Floating Car */}
                <img
                    src="/src/assets/caru.png"
                    alt="Car"
                    className="absolute w-[100%] right-[-0px] bottom-[40px] object-contain drop-shadow-2xl hover:scale-115 transition duration-500"
                />

            </div>

        </main>    
        </>
    )
}

export function Cars(){
    const [cars, setCars] = useState([])
    const [featured, setFeat] = useState([])

    useEffect(()=>{
        const fetch_results = async () => {
            const results = await axios.get('http://localhost/Car-Rental-Website/back/landing.php')
            setCars(results.data.cars)
            setFeat(results.data.featured)
        }

        fetch_results()
    }, [])

    return(
        <>
        <section className="w-full h-screen bg-gray-300">
            <div className="carousel w-full overflow-auto h-[90%] flex">
                {cars.map(car=>(
                    <div key={car.car_id} className="bg-gray-400 w-32 h-[90%] p-2">
                        <img src={car.image} alt="" />
                        <p>{car.model}</p>
                    </div>  
                ))}
            </div>
        </section>
        </>
    )
}

export function About(){
    return(
        <section className="w-full h-screen bg-gray-200 flex justify-center pt-30" id="About">
            <div className="w-full h-[90%] bg-white shadow-lg rounded-xl p-10 ">
                
            <div className="border-t my-10"> </div>

                <h1 className="text-4xl font-bold mb-6 text-center">
                    About Us
                </h1>

                <p className="text-xl text-center max-w-5xl mx-auto mb-6">
                    MLT Car Rental is a platform created to provide a simple,
                    affordable, and accessible car rental experience. Our goal
                    is to help users easily explore vehicles and choose the
                    perfect ride for their journey.
                </p>

                <p className="text-xl text-center max-w-6xl mx-auto mb-6">
                    This website is designed with accessibility in mind,
                    supporting clear layouts, readable text, and navigation
                    that can be easily used by people with visual impairments.
                </p>

                <div className="border-t my-10"> </div>

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
                    className="flex items-center space-x-3 hover:text-red-500 transition"
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

            </div>
        </section>
    )
}