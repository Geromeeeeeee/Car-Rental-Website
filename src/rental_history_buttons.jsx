import { useNavigate } from "react-router-dom"
import {useState} from "react"
import axios from "axios"
import { API_BASE_URL } from "./config"
import { PopUp } from "./pop-up"
import { ExtendRentalModal } from "./extend"
import { FaCreditCard, FaRegWindowClose, FaEllipsisH, FaTruckPickup, FaRegClock, FaCheckSquare } from "react-icons/fa";
import { DiEnvato } from "react-icons/di"

export function Rental_Buttons ({type, requests}){

    const [early, setEarly] = useState(false)
    const [chosenDate, setChosenDate] = useState("");
    const [refund, setRefund] = useState(0)
    const [lateFee, setLateFee] = useState(0)
    const [cancelPopUp, setCancelPopUp] = useState(false)
    const [showPopUp, setShowPopUp] = useState(false)
    const [extendPopUp, setExtendPopUp] = useState(false)
    const [popUpMessage, setPopUpMessage] = useState("")
    const [messageType, setMessageType] = useState("") 
    const nav = useNavigate()

    const cancel_request = async () => {
        const send_cancel_req = await axios.post(`${API_BASE_URL}/back/rental_history.php`, {action: "cancel", reqID: requests.request_id}, {withCredentials: true})
                            
        const request_stat = send_cancel_req.data.cancelled
        if(send_cancel_req.data.cancelled) {
            setShowPopUp(true)
            setMessageType("Success")
            setPopUpMessage("Rental request Cancelled. Check Rental History for more info.")
        } else {
            alert("Request Error");
        }
    }
    const cancelButton = (
    <button className="log-in w-[fit] h-[fit] p-2.5 px-5 mx-2.5 my-1.5 transition duration-150ms ease-in-out bg-red-500 text-white rounded-lg text-l hover:scale-[1.075]" onClick={()=>cancel_request()}>Cancel
    </button> 
    )
    const cancelModal = (
    <button className="log-in w-[fit] p-1.5 mx-2.5 my-1.5 transition duration-150ms ease-in-out text-red-500 rounded-lg text-sm shadow-sm hover:bg-red-200 inline-flex items-center" 
    onClick={()=>setCancelPopUp(true)}>
    <FaRegWindowClose size={16} className="mr-2.5" />
    Cancel
    </button> 
    )
    switch (type){
        case "Pending":
            return(
                <div className="ml-auto h-100% w-fit flex flex-col items-center justify-center">
                {(requests.request_status === 'Approved' && (requests.payment_status === 'Unpaid' || requests.payment_status === 'Downpayment Reupload Required')) && (
                    <button className="log-in w-fit text-sm p-1.5 rounded-lg text-blue-500 mx-2.5 my-1.5 inline-flex items-center shadow-sm hover:bg-blue-200" onClick={() => nav("/payment_form", { state: { paymentDetails: requests, type: 'Downpayment' } })}>
                    <FaCreditCard size={16} className="mr-2.5" />
                    {requests.payment_status === 'Unpaid' ? "Downpayment" : "Re-upload"}
                    </button>)}
                    {(requests.request_status === 'Approved' && requests.payment_status === 'Final Reupload Required') && (
                    <button className="log-in p-2.5 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-800 m-2.5" onClick={() => nav("/payment_form", { state: { paymentDetails: requests, type: 'Final Payment' } })}>
                    Reupload Final Proof
                    </button>)}
                    {cancelModal}

                    <div className={`fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center transition-opacity z-50 ${cancelPopUp ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={()=>setCancelPopUp(false)}>
                    <div className="bg-white rounded-lg shadow-lg w-[35vw] h-[35vh] overflow-clip flex flex-col">
                    <div className="bg-red-500 p-2.5">
                    <h1 className="font-semibold text-white text-xl">Warning!</h1>
                    </div>
                    <div className="flex grow text-black/80 p-2.5 justify-center items-center text-center">
                        <p className="m-2.5">
                        Are you sure you want to cancel? Any downpayments made will not be refunded.
                        </p>
                    </div>
                    <div className="w-full h-fit p-2.5 flex justify-around">
                        <button className=" w-[fit] h-[fit] p-2.5 px-5 mx-2.5 my-1.5 transition duration-150ms ease-in-out bg-green-500 text-white font-semibold rounded-lg text-l hover:scale-[1.075]" onClick={()=>setCancelPopUp(false)}>No</button>
                        {cancelButton}
                    </div>
                    </div>
                    </div>  
                    <PopUp show={showPopUp} message={popUpMessage} type={messageType}/>
                </div>
            )
        case "Verification Pending":
            return(
                <div className="ml-auto h-100% w-fit flex items-center justify-center">
                    <div className="text-yellow-400 p-1.5 rounded-lg mx-2.5 my-1.5 inline-flex items-center shadow-sm">
                        <FaEllipsisH size={16} className="mr-2.5"/>
                        Verification Pending
                    </div>
                </div>
            )
        case "Approved":
            return(
                <div className="ml-auto h-100% w-fit flex items-center justify-center">
                {requests.payment_status === 'Downpayment Verified' ? (
                    <button className="log-in w-fit text-sm p-1.5 rounded-lg text-blue-500 mx-2.5 my-1.5 inline-flex items-center shadow-sm hover:bg-blue-200" onClick={() => nav("/payment_form", { state: { paymentDetails: requests, type: 'Final Payment' } })}>
                        <FaCreditCard size={16} className="mr-2.5" />
                        Final Balance
                    </button>
                ) : (
                    <div className="text-blue-500 p-1.5 rounded-lg mx-2.5 my-1.5 inline-flex items-center shadow-sm">
                        <FaTruckPickup size={16} className="mr-2.5"/>
                        Pickup Scheduled
                        </div>
                    )}
                </div>
            )
        case "Active":{
            const isLate = parseInt(requests.is_late) === 1;
            const isEarly = parseInt(requests.is_early) === 1;
            const start = new Date(requests.rental_date); 

            const maxRentalDate = new Date(start);
            maxRentalDate.setDate(start.getDate() + (parseInt(requests.rental_duration_days) - 2));

            const maxDate = maxRentalDate.toISOString().split('T')[0];
            const today = new Date();

            const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const req_return = async (returnType, customReturnDate = null) => {
                const payload = {
                    action: "return", 
                    reqID: requests.request_id, 
                    returnType: returnType,
                    date: customReturnDate || new Date().toISOString().split('T')[0]
                }

                const send_return_req = await axios.post(`${API_BASE_URL}/back/rental_history.php`, payload, { withCredentials: true })

                if (send_return_req.data.return) {
                    const message = (returnType === "late" ? 
                        `Late return requested. Late Fee: ₱${send_return_req.data.late_fee}` : `Return requested. Refund: ₱${send_return_req.data.refund}`);
                    setRefund(send_return_req.data.refund || 0);
                    setLateFee(send_return_req.data.late_fee || 0);
                    setShowPopUp(true)
                    setMessageType("Success")
                    setPopUpMessage(message)                  
                } else {
                    setShowPopUp(true)
                    setMessageType("Error")
                    setPopUpMessage("Error submitting return request.")
                }
            }

            const returnStat = ["Early Return Requested", "Return Requested", "Late Return Requested"].includes(requests.request_status);
            const isApproved = ["Early Return Approved", "Return Approved", "Late Return Approved"].includes(requests.request_status);
            const buttonText = isEarly ? "Return Early" : (isLate ? "Return Late" : "Return");
            const returnType = isEarly ? "early" : (isLate ? "late" : "on_time");

            return(
                <>
                <PopUp show={showPopUp} message={popUpMessage} type={messageType}/>
                <ExtendRentalModal
                    show={extendPopUp}
                    setShow={setExtendPopUp}
                    carID={requests.car_id}
                    currentRentalStart={requests.rental_date}
                    reqID={requests.request_id}
                />
                <div className="m-auto h-100% w-fit flex flex-col items-center justify-center">
                {returnStat ? (
                <button className="w-fit text-sm p-1.5 rounded-lg text-blue-500 mx-2.5 my-1.5 inline-flex items-center shadow-sm">
                    <FaEllipsisH size={16} className="mr-2.5"/>
                    Return Request Processing
                </button>
                ) : isApproved ? (
                <div className="w-fit text-sm p-1.5 rounded-lg text-blue-500 mx-2.5 my-1.5 inline-flex items-center shadow-sm">
                    <FaCheckSquare size={16} className="mr-2.5"/>
                    Return Approved: Ready For Drop Off
                </div>
                ) : (
                <>
                <button className="log-in w-fit text-sm p-1.5 rounded-lg text-blue-500 mx-2.5 my-1.5 inline-flex items-center shadow-sm hover:bg-blue-200" onClick={() => isEarly ? setEarly(true) : req_return(returnType)}>
                    <FaRegClock size={16} className="mr-2.5"/>
                    {buttonText}
                </button>
                {requests.payment_status === "Extension Payment Pending" ? (
                <button
                className="log-in w-fit text-sm p-1.5 rounded-lg text-blue-500 mx-2.5 my-1.5 inline-flex items-center shadow-sm hover:bg-blue-200"
                onClick={() => nav("/payment_form", { state: { paymentDetails: requests, type: "Extension" } })}
                >
                <FaCreditCard size={16} className="mr-2.5" />
                Pay Extension
                </button>
                ) : (
                <button disabled={requests.status === 'Pending' || requests.payment_status === 'Extension Proof Uploaded'}
                className={`w-fit text-sm p-1.5 rounded-lg text-blue-500 mx-2.5 my-1.5 inline-flex items-center shadow-sm
                ${requests.status === 'Pending' || requests.payment_status === 'Extension Proof Uploaded'
                    ? "bg-gray-200 cursor-not-allowed" : 'bg-white hover:bg-blue-200'}`}
                onClick={() => setExtendPopUp(true)}
                >
                {requests.status === 'Pending' || requests.payment_status === 'Extension Proof Uploaded' ? (<FaEllipsisH size={16} className="mr-2.5"/>) : (<FaRegClock size={16} className="mr-2.5"/>)}
                {requests.status === 'Pending' 
                ? "Extension Pending" : 
                requests.payment_status === 'Extension Proof Uploaded' ? "Extension Payment Under Review" : "Extend Rental"}
                </button>
                )}
                </>               
                )}
                {early && (
                    
                <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center shadow-lg text-black max-w-sm w-full">
                    <h1 className="text-xl font-bold mb-2">Schedule Early Return</h1>
                    <p className="text-sm text-gray-500 mb-4">Please pick your expected vehicle drop-off date:</p>
                        <input 
                            type="date" 
                            min={minDate}
                            max={maxDate}
                            value={chosenDate}
                            onChange={(e) => setChosenDate(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 mb-5 w-full focus:outline-none focus:border-blue-500"
                        />

                        <div className="flex w-full justify-center">
                            <button className="log-in px-4 py-2 transition duration-150ms ease-in-out bg-green-500 text-white font-bold rounded-lg text-l hover:scale-[1.05] m-2" onClick={() => {
                                if (!chosenDate) {
                                    alert("Please select a date first!")
                                    return
                                }
                                    setEarly(false)
                                    req_return("early", chosenDate) // sends type and chosen calendar date
                                }}
                                >
                                Yes
                                </button>
                                <button className="log-in px-4 py-2 transition duration-150ms ease-in-out bg-red-500 text-white font-bold rounded-lg text-l hover:scale-[1.05] m-2" onClick={() => setEarly(false)}>
                                No
                                </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                </>
            )
        }

    }
}