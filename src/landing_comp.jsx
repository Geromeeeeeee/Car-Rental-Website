import { useState, useEffect } from "react"
import axios from "axios"

export function Nav(){
    return(
        <>
        <nav className="w-full h-[12.5vh] flex justify-between items-center p-5 ">
            <div className="h-full w-[50%] flex items-center">
                <img src="/src/assets/MLT_logo.png" alt="Logo" className="h-[200%] aspect-square"/>
                <div className="flex space-x-6 ml-10">
                    <a href="#" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Home</a>
                    <a href="#" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">About</a>
                    <a href="#" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Cars</a>
                    <a href="#" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Contact</a>
                </div>
            </div>
            
            <div className="log-in w-fit h-full">
                <button className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-black text-white font-bold rounded-lg text-l hover:scale-[1.075]">Login/Signup</button>
            </div>
        </nav>
        </>
    )
}

export function Home(){
    return(
        <>
        <main className="flex w-full h-[80vh]">
            <div className="left w-[50%] h-full p-5 flex flex-col justify-center">
                <div className="flex flex-col justify-start h-full m-5">
                    <h3 className="font-bold text-[12vh]">Welcome To MLT</h3>
                    <h1 className="font-bold text-[6vh]">A Car Rental Website</h1>
                </div>
                <div className="text-start w-[90%] m-5">
                    <p className="text-[4.5vh]">An accessible and affordable high-quality car rental service. Choose your ride. Start your journey.
                    See the story the road has to offer</p>
                </div>
            </div>
            <div className="right w-[50%] h-full">
                <div className="[clip-path:circle(50%_at_80%_50%)] bg-gray-300 h-full w-full">

                </div>
            </div>
        </main>    
        </>
    )
}

export function Cars(){
    const [cars, setCars] = useState([]);
    const [featured, setFeat] = useState([]);

    useEffect(()=>{
        const fetch_results = async () => {
            const results = await axios.get('http://localhost/Car-Rental-Website/back/landing.php')
            setCars(results.data.cars)
            setFeat(results.data.featured)
        }

        fetch_results();
    }, [])

    return(
        <>
        <section className="w-full h-screen bg-gray-300">
            <div className="carousel w-full overflow-auto h-[90%] flex">
                {cars.map(car=>(
                    <div key={car.car_id} className="bg-gray-400 w-32 h-[90%]">
                        <img src={car.image} alt="" />
                        <p>{car.model}</p>
                    </div>  
                ))}
            </div>
        </section>
        </>
    )
}

export function Contact(){
    return(
        <section className="w-full h-screen bg-gray-200">
        
        </section>
    )
}
