import axios from "axios"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL, API_BASE_URL_ADMIN } from "./config"
import { Rental_Buttons } from "./rental_history_buttons"

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: "numeric",
    month: "long",
    day: '2-digit'
})

const return_date = (startDate, duration) =>{
    const date = new Date(startDate)
    date.setDate(date.getDate()+(parseInt(duration)-1))
    return dateFormatter.format(date)
}

export function Rental_History_Table({type, list}){
    const nav = useNavigate()
    return(
        <>
        <div className="flex flex-col h-fit w-full p-2.5 box-border justify-center items-center overflow-hidden">
        <h1 className="text-2xl font-bold mb-2.5">{type}</h1>
        <table className="w-[90vw] h-fit border-collapse rounded-2xl border border-gray-600/25 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.125)] overflow-hidden">
            <thead>
                <tr className="rounded-tl-2xl">
                    <th className="p-2.5">Vehicle</th>
                    <th className="p-2.5">Cost</th>
                    <th className="p-2.5">Duration</th>
                    <th className="p-2.5">Pickup Date: </th>
                    <th className="p-2.5">Return Date: </th>
                    <th className="p-2.5">Status</th>
                    {type === "Cancelled" ? null : 
                    <th className="p-2.5">
                        {type === "Completed" ? "Refund Amount" : "Action"}
                    </th>
                    }
                </tr>
            </thead>
            <tbody>
                {list.map((requests,index)=>{
                const pickupDate = dateFormatter.format(new Date(requests.rental_date))
                const returnDate = return_date(requests.rental_date, requests.rental_duration_days)
                //Buttons. Hindi ko na siya mapaikli
                return(
                <tr key={index}>
                    <td className="text-center">{requests.model}</td>
                    <td className="text-center">{requests.total_cost}</td>
                    <td className="text-center">{requests.rental_duration_days} Days</td>
                    <td className="text-center">{pickupDate}</td>
                    <td className="text-center">
                        {type === "Completed" ? requests.return_date_actual : returnDate}
                    </td>
                    <td className="text-center">{type === "Active" ? requests.request_status : type}</td>
                    {type === "Cancelled" ? null : 
                    <td className="text-center p-1.5">
                        {type === "Completed" ? requests.final_refund_amount : 
                        <Rental_Buttons
                            type={type}
                            requests={requests}
                        />}
                    </td>
                    }
                </tr>
                )
                })}
            </tbody>
        </table>
        </div>
        </>
    )
}