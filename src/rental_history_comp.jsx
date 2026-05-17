import axios from "axios"
import { useNavigate } from "react-router-dom"

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

export function Rental_History_Block({type, list}){
    const nav = useNavigate()
    return(
        <>
        <div className="flex flex-col h-fit w-full p-2.5 box-border justify-center items-center">
            <h1 className="text-2xl font-bold mb-2.5">{type}</h1>
            {list.length === 0 ? (
                <div className="flex flex-col w-[90vw] h-[15vh] rounded-2xl border border-gray-600/25">
                    <h1 className="text-xl text-black/50 m-auto">No History To Show</h1>
                </div>
            ) : (
                <div className="flex flex-col w-[90vw] h-fit rounded-2xl border border-gray-600/25 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.125)]">
                    {list.map((requests)=>{

                        const pickupDate = dateFormatter.format(new Date(requests.rental_date))
                        const returnDate = return_date(requests.rental_date, requests.rental_duration_days)

                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        const [year, month, day] = requests.rental_date.split("-").map(Number);

                        const maxRentalDate = new Date(year, month - 1, day);
                        maxRentalDate.setDate(maxRentalDate.getDate() + (parseInt(requests.rental_duration_days) - 1));
                        maxRentalDate.setHours(0, 0, 0, 0);

                        const isEarlyReturn = today < maxRentalDate;

                        const cancel_request = async (id) => {
                            const send_cancel_req = await axios.post("http://localhost/Car-Rental-Website/back/rental_history.php", {action: "cancel", reqID: requests.request_id}, {withCredentials: true})
                            
                            const request_stat = send_cancel_req.data.cancelled
                            {request_stat ? (
                                alert("Request Cancelled"),
                                window.location.reload()
                            ) : (
                                alert("Request Error")
                            )}
                        }

                        const cancelButton = (
                            <button className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-black text-white font-bold rounded-lg text-l hover:scale-[1.075]" onClick={()=>cancel_request(requests.request_id)}>Cancel
                            </button> 
                        )

                        const req_return = async (returnType) => {
                            const send_return_req = await axios.post("http://localhost/Car-Rental-Website/back/rental_history.php", {action: "return", reqID: requests.request_id, returnType: returnType}, {withCredentials: true})

                            if(send_return_req.data.return){
                                 alert(`Return requested. Expected Refund: ${send_return_req.data.refund}`)
                                window.location.reload()
                            } else {
                                alert("Error")
                            }
                        }

                        let stat_button
                        if (type==="Pending") {
                            stat_button = (
                                <div className="ml-auto h-100% w-fit flex items-center justify-center">
                                    {(requests.request_status === 'Approved' && requests.payment_status === 'Unpaid') && (
                                    <button className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-blue-500 text-white font-bold rounded-lg text-l hover:scale-[1.075] hover:bg-blue-800 m-2.5" onClick={()=>nav("/payment_form", {state:{paymentDetails: requests}})}>
                                        Payment
                                    </button>
                                    )}
                                    {cancelButton}  
                                </div>
                            )
                            } else if (type==="Approved"){
                                stat_button = (
                                    <div className="ml-auto h-100% w-fit flex items-center justify-center">
                                        <div className="ml-auto h-100% w-fit flex items-center justify-center">
                                            <div className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-black/50 text-white font-bold rounded-lg text-l m-2.5">Pickup on pickup date</div>
                                            {cancelButton}
                                        </div>  
                                    </div>
                                )
                            } else if (type === "Active"){
                                const buttonText = isEarlyReturn ? "Return Early" : "Return"
                                const returnStat = requests.request_status === "Return Requested" || requests.request_status === "Early Return Requested"

                                let returnType = "on_time"
                                if(isEarlyReturn){
                                    returnType = "early"
                                } else if (today>maxRentalDate){
                                    returnType = "late"
                                }
                            
                                stat_button = (
                                    <div className="ml-auto h-100% w-fit flex items-center justify-center">
                                        <div className="ml-auto h-100% w-fit flex items-center justify-center">
                                            {returnStat ? (
                                                <button className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-black/50 text-white font-bold rounded-lg text-l m-2.5">Return Processing...</button>
                                            ):(
                                                <button className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-blue-500 text-white font-bold rounded-lg text-l hover:scale-[1.075] hover:bg-blue-800 m-2.5" onClick={()=>req_return(returnType)}>{buttonText}</button>
                                            )}
                                        </div>  
                                    </div>
                                )
                            } else if (type === "Paid"){
                                stat_button = (
                                    <div className="ml-auto h-100% w-fit flex items-center justify-center">
                                        <div className="ml-auto h-100% w-fit flex items-center justify-center">
                                            <div className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-black/50 text-white font-bold rounded-lg text-l m-2.5">Payment to be approved</div>
                                        </div>  
                                    </div>
                                )
                            } else {    
                                stat_button = null
                            }

                        return(
                            <div key={requests.request_id} className="w-full h-fit min-h-[35vh] bg-white-400 p-5 flex border-b border-b-gray-600/50 last:border-b-0">

                            <img src={`http://localhost/vnm-system1/php/cars/uploads/cars/${requests.image}`} alt="" className="w-[20%] aspect-auto rounded-xl"/>

                            <div className="flex flex-col w-[35%] h-100% p-3 justify-around">
                                <p className=" text-xl font-bold w-full">{requests.model}</p>
                                <p><b>Duration: </b>{requests.rental_duration_days} Days</p>
                                <p><b>Price: </b> {requests.total_cost}</p>
                                <p><b>Pickup Date: </b> {pickupDate}</p>
                                <p><b>Return Date: </b> {returnDate}</p>
                            </div>
                            
                            {stat_button}

                        </div>
                        )
                    })}
                </div>
                )}
        </div>
        </>
    )
}