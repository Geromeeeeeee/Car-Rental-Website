import { useState } from "react";
import { useLocation } from "react-router-dom"

export function RentalForm(){
    const loc = useLocation();
    const carDetails = loc.state?.car;

    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [duration, setDuration] = useState(1)
    const [photo, setPhoto] = useState(null)
    const missingField = !date || !time || !duration || !photo

    const totalPrice = carDetails?carDetails.daily_rate*duration:0

    return(
        <div className="w-100% h-screen bg-white rounded-xl shadow-lg flex items-center justify-center p-7.5">
            <div className="w-[40%] h-full">
                <img src={`http://localhost/vnm-system1-copy/php/cars/uploads/cars/${carDetails?.image}`} alt="" className="w-full h-full overflow-hidden object-cover rounded-lg"/>
            </div>
             <form action="" className="w-[60%] h-full px-7.5 flex flex-col">
                <input type="text" name="" id="" readOnly required value={carDetails.model} className="text-center text-3xl font-bold w-full "/>

                <label htmlFor="date">Pickup Date: </label>
                <input type="date" name="" id="" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5" onChange={(e)=>setDate(e.target.value)} value={date}/>

                <label htmlFor="time">Pickup Time: </label>
                <input type="time" name="" id="" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5" onChange={(e)=>setTime(e.target.value)} value={time}/>

                <label htmlFor="duration">Duration/Days</label>
                <input type="number" name="" id="" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5" onChange={(e)=>setDuration(e.target.value)} value={duration}/>

                <label htmlFor="price">Total Price: </label>
                <input type="number" name="" id="" value={totalPrice} readOnly required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5"/>

                <label htmlFor="licensePhoto">Driver's License</label>
                <input type="file" name="" id="" required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5" onChange={(e)=>setPhoto(e.target.files[0])}/>

                {missingField ? 
                <button type="submit" disabled={true} className="w-full bg-gray-500 text-white py-2 rounded-lg font-bold mt-auto">
                    Confirm
                </button>
                 : 
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition duration-300 mt-auto">
                    Confirm
                </button>
                }
            </form>
        </div>
    )
}