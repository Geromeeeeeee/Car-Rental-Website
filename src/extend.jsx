import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { API_BASE_URL } from "./config"
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker"

export function ExtendRentalModal({show, setShow, carID, reqID, currentRentalStart}){
    if(!show) return null
    const nav = useNavigate()

    const [bookedDates, setBookedDates] = useState([])
    const [selectedDate, setSelectedDate] = useState(null)

    useEffect(()=>{
        if(show && carID){
            const getDates = async ()=> {
                const formData = new FormData()
                formData.append("action", "getDates")
                formData.append("carID", carID)

                const disabledDates = await axios.post(
                    `${API_BASE_URL}/back/rent.php`,
                    formData,
                    {withCredentials: true}
                );

                setBookedDates(disabledDates.data.booked_dates || [])
            };
            getDates();
        }
    }, [show, carID]);

    const currentStartDate = currentRentalStart
        ? (() => {
            const [y, m, d] = currentRentalStart.split('-').map(Number)
            return new Date(y, m - 1, d)
        })()
        : null

    const nextBookingStart = bookedDates
        .map(r => {
            const [y, m, d] = r.start_date.split('-').map(Number)
            return new Date(y, m - 1, d)
        })
        .filter(date => !currentStartDate || date > currentStartDate)
        .sort((a, b) => a - b)[0]

    const maxExtensionDate = nextBookingStart
        ? new Date(nextBookingStart.getFullYear(), nextBookingStart.getMonth(), nextBookingStart.getDate() - 2)
        : null

    const excludedDateIntervals = bookedDates.map((range) => {
        const [sY, sM, sD] = range.start_date.split('-').map(Number)
        const [eY, eM, eD] = range.end_date.split('-').map(Number)

        const start = new Date(sY, sM - 1, sD)
        const end = new Date(eY, eM - 1, eD)

        if(currentRentalStart && range.start_date === currentRentalStart){
            end.setDate(end.getDate() - 1)
        }

        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)

        return { start, end }
    })

    const extendRental = async ()=>{
        const reqFormData = new FormData()
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
        const day = String(selectedDate.getDate()).padStart(2, "0")
        const formattedDate = `${year}-${month}-${day}`
        reqFormData.append("action", "extend request")
        reqFormData.append("newEndDate", formattedDate)
        reqFormData.append("reqID", reqID)
        reqFormData.append("carID", carID)
        const sendExtendRequest = await axios.post(`${API_BASE_URL}/back/rent.php`,
            reqFormData,
            {withCredentials: true}
        )
        if(sendExtendRequest.data){
            alert(`Appx. Additional Cost: ${sendExtendRequest.data.addtl_cost}`)
        } else {
            alert("Error")
        }
    }

    return(
    <>
    <div className="fixed top-0 left-0 w-full h-full bg-black/25 flex items-center justify-center transition-opacity z-50" onClick={()=>setShow(false)}>
        <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-start shadow-lg text-black max-w-sm w-full" onClick={(e)=>e.stopPropagation()}>
            <h1 className="text-xl font-bold mb-2">Extend Rental</h1>
            <p className="text-sm text-gray-500 mb-4 text-center">Extend your rental based on the available dates. Some dates may be blocked off due to earlier bookings</p>
            <div className="flex justify-around w-full h-[25%] grow items-center my-2.5">
                <label htmlFor="date">Select Date</label>
                <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                excludeDateIntervals={excludedDateIntervals}
                minDate={new Date()}
                maxDate={maxExtensionDate}
                placeholderText="Select date"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="flex justify-around w-full h-[25%] grow items-center mt-2.5">
                <button className="log-in px-4 py-2 transition duration-150ms ease-in-out bg-red-500 text-white rounded-lg text-base hover:scale-[1.05]" onClick={()=>setShow(false)}>
                    Cancel
                </button>
                <button className="log-in px-4 py-2 transition duration-150ms ease-in-out bg-green-500 text-white rounded-lg text-base hover:scale-[1.05]" onClick={()=>extendRental()}>
                    Confirm
                </button>
            </div>
        </div>
    </div>
    </>
    )
}