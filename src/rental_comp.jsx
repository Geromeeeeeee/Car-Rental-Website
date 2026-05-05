import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function RentalForm(){
    const nav = useNavigate()
    const loc = useLocation();
    const carDetails = loc.state?.car;

    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [duration, setDuration] = useState(1)
    const [photo, setPhoto] = useState(null)
    const missingField = !date || !time || !duration || !photo
    const totalPrice = carDetails?carDetails.daily_rate*duration:0

    const [bookedDates, setBookedDates] = useState([])
    useEffect(()=>{
        const getDates = async ()=>{
            const formData = new FormData();
            formData.append("action", "getDates")
            formData.append("carID", carDetails.car_id)

            const disabledDates = await axios.post(
                'http://localhost/Car-Rental-Website/back/rent.php',
                formData,
                {withCredentials: true}
            )

            setBookedDates(disabledDates.data.booked_dates || [])
        }

        if(carDetails?.car_id){
            getDates()
        }
    },[carDetails?.car_id])

    const excluded_dates = bookedDates.map(range=>{
        const start = new Date (range.start_date)
        const end = new Date (range.end_date)

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return{start: start, end: end}
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData();
            formData.append("action", "request")
            formData.append("carID", carDetails.car_id)
            formData.append("date", date)
            formData.append("time", time)
            formData.append("duration", duration)
            formData.append("photo", photo)
            formData.append("totalPrice", totalPrice)

            const rentalDetail = await axios.post(
                'http://localhost/Car-Rental-Website/back/rent.php',
                formData,
                {withCredentials: true}
            )
            const logged = rentalDetail.data.logged_in
            if(logged === false){
                nav("/")
            }

            const req_stat = rentalDetail.data.request_stat
            const error = rentalDetail.data.error
            if(req_stat === true){
                alert("Request now pending")
                nav("/")
            } else{
                if(error === 'overlap'){
                    alert("Rental date overlaps with future booked dates")
                } else if (error === 'duration'){
                    alert("Duration must be greater than 0")
                } else {
                    alert("Error")
                }
            }
            
        } catch (error) {
            alert("Server Error")
        }
    }

    return(
        <div className="w-100% h-screen bg-white rounded-xl shadow-lg flex items-center justify-center p-7.5">
            <div className="w-[40%] h-full">
                <img src={`http://localhost/vnm-system1-copy/php/cars/uploads/cars/${carDetails?.image}`} alt="" className="w-full h-full overflow-hidden object-cover rounded-lg"/>
            </div>
             <form onSubmit={handleSubmit} className="w-[60%] h-full px-7.5 flex flex-col">
                <input type="text" name="" id="" readOnly required value={carDetails.model} className="text-center text-3xl font-bold w-full "/>

                <label htmlFor="date">Pickup Date: </label>
                <DatePicker selected={date ? new Date(date) : null}
                onChange={(selectedDate)=>{
                    if(selectedDate){
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        const day = String(selectedDate.getDate()).padStart(2, '0');
                        setDate(`${year}-${month}-${day}`);
                    }
                }}
                excludeDateIntervals = {excluded_dates}
                minDate = {new Date()}
                placeholderText = "Pickup Date"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5"/>

                <label htmlFor="time">Pickup Time: </label>
                <input type="time" name="" id="" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5" placeholder="Pickup Time" onChange={(e)=>setTime(e.target.value)} value={time}/>

                <label htmlFor="duration">Duration/Days</label>
                <input type="number" name="" id="" min="1" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5" onChange={(e)=>setDuration(e.target.value)} value={duration}/>

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