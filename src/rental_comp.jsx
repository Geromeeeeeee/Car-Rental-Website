import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL, API_BASE_URL_ADMIN } from "./config";

export function RentalForm(){
    const nav = useNavigate()
    const loc = useLocation();
    const carDetails = loc.state?.car;

    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [duration, setDuration] = useState(1)
    const [photo, setPhoto] = useState(null)
    const [tnc, setTnc] = useState(false)
    const [showTNC, setShowTNC] = useState(false)
    const missingField = !date || !time || !duration || !photo || !tnc
    const totalPrice = carDetails?carDetails.daily_rate*duration:0

    const [bookedDates, setBookedDates] = useState([])
    useEffect(()=>{
        const getDates = async ()=>{
            const formData = new FormData();
            formData.append("action", "getDates")
            formData.append("carID", carDetails.car_id)

            const disabledDates = await axios.post(
                `${API_BASE_URL}/back/rent.php`,
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
                `${API_BASE_URL}/back/rent.php`,
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
        <>
        <div className="w-100% h-screen bg-white rounded-xl shadow-lg flex items-center justify-center p-7.5">
            <div className="w-[40%] h-full">
                <img src={`${API_BASE_URL_ADMIN}/Uploads/Cars/${carDetails?.image}`} alt="" className="w-full h-full overflow-hidden object-cover rounded-lg"/>
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
                <select name="time" id="time" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5" onChange={(e)=>setTime(e.target.value)} value={time}>
                    <option value="">Select Time</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                </select>

                <label htmlFor="duration">Duration/Days</label>
                <input type="number" name="" id="" min="1" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5" onChange={(e)=>setDuration(e.target.value)} value={duration}/>

                <label htmlFor="price">Total Price: </label>
                <input type="number" name="" id="" value={totalPrice} readOnly required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5"/>

                <label htmlFor="licensePhoto">Driver's License</label>
                <input type="file" name="" id="" required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5" onChange={(e)=>setPhoto(e.target.files[0])}/>

                <div className="w-full h-fit flex gap-2.5 p-2">
                    <input type="checkbox" name="terms" id="terms" checked={tnc} 
                        onChange={(e) => setTnc(e.target.checked)}/>
                    <label htmlFor="checkbox">I agree to the {""}
                        <button type="button" className="text-blue-500" onClick={() => setShowTNC(true)}>
                            Terms and Conditions
                        </button>
                    </label>
                </div>

                <button type="submit" disabled={missingField} className={`w-full text-white py-2 rounded-lg font-bold mt-auto ${missingField ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 transition duration-300 mt-auto"}`}>
                    Confirm
                </button>
            </form>
        </div>

        {showTNC && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4" onClick={() => setShowTNC(false)}>
                <div className="w-[40vw] h-fit bg-white rounded-lg flex flex-col justify-start p-5" onClick={(e)=>e.stopPropagation()}>
                    <h1 className="text-xl font-bold mb-2.5">Terms and Conditions</h1>
                    <hr className="mb-2.5"/>
                    <p className="mb-1">1. The renter must have a valid driver's license</p>
                    <p className="mb-1">2. The vehicle must be returned with the same amount of fuel as provided at pickup.</p>
                    <p className="mb-1">3. Any damage incurred during the rental period is the sole responsibility of the renter.</p>
                    <p className="mb-1">4. Late returns will incur an additional daily charge as specified in our rates.</p>
                    <p className="mb-2.5">5. The vehicle shall NOT be used for any illegal activities or unauthorized transport.</p>
                    <hr className="mb-2.5"/>
                    <div className="w-full h-fit flex justify-between">
                    <button className="bg-gray-500 transition duration-300 p-2.5 text-white  rounded-lg" onClick={()=>setShowTNC(false)}>Close</button>
                    <button className="bg-blue-500 hover:bg-blue-700 transition duration-300  p-2.5 text-white rounded-lg" onClick={()=>{setTnc(true), setShowTNC(false)}}>Close and agree</button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}