import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function PaymentForm(){
    const location = useLocation()
    const navigate = useNavigate()
    const [method, setMethod] = useState("")
    const [proof, setProof] = useState(null)
    const [ref, setRef] = useState("")
    const { paymentDetails, type } = location.state || {}
    const missingField = !method || !proof || !ref

    const total = parseFloat(paymentDetails.total_cost)
    const downpaymentAmount = total * 0.50
    const finalPaymentAmount = total - downpaymentAmount

    const displayAmount = type === 'Downpayment' ? downpaymentAmount : finalPaymentAmount

    const payment = async (e) => {
        e.preventDefault()
        if(missingField){
            alert("Fill all required fields!")
            return
        }
        let response
        try{
            const formData = new FormData();
            formData.append("action", "payment")
            formData.append("method", method)
            formData.append("proof", proof)
            formData.append("ref", ref)
            formData.append("reqID", paymentDetails.request_id)
            formData.append("paymentType", type)

            response = await axios.post('http://localhost/Car-Rental-Website/back/payment.php', formData, {withCredentials: true})

        }catch{
            alert("Eror")
        }
        const status = response.data.payment
        if(status){
            alert("Payment Processed")
            navigate("/")
        } else {
            alert ("Processing Error")
        }
    }

    return(
        <>
        <div className="w-100% h-screen bg-white rounded-xl shadow-lg flex items-center justify-center p-7.5">
            <div className="w-[40%] h-full">
                {method ? (
                    <img src={method === 'gcash'? "src/assets/gcash_qr.jpg" : "src/assets/maya qr.png"} alt="" className="w-full h-full overflow-hidden object-contain rounded-lg"/>
                ) : (
                    <div className="w-full h-full grid rounded-2xl border border-gray-600/25 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.125)]">
                        <h1 className="text-xl text-black/50 m-auto">Select Payment Method</h1>
                    </div>
                )}
            </div>
            <form onSubmit={payment} className="w-[60%] h-full px-7.5 flex flex-col">
                <legend className="text-center text-3xl font-bold w-full ">Payment Summary</legend>
                <label htmlFor="model">Model: </label>
                <input type="text" name="" id="" value={paymentDetails.model} readOnly required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5"/>

                <label htmlFor="price">Total Price: </label>
                <input type="number" name="" id="" value={displayAmount} readOnly required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5"/>

                <label htmlFor="method">Payment Method: </label>
                <select name="method" id="method" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5" value={method} onChange={(e)=>setMethod(e.target.value)}>
                    <option value="">Select Payment Method</option>
                    <option value="gcash">Gcash</option>
                    <option value="maya">Maya</option>
                </select>

                <label htmlFor="proof">Proof of Payment: </label>
                <input type="file" name="proof" id="" required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5" onChange={(e)=>setProof(e.target.files[0])}/>

                <label htmlFor="ref">Payment Reference No.</label>
                <input type="text" name="ref" id="ref" min="1" required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-2.5" onChange={(e)=>setRef(e.target.value)} maxLength={method === 'gcash' ? 13 : 16} minLength={method === 'gcash' ? 13 : 16}/>

                <button type="submit" className={`w-full text-white py-2 rounded-lg font-bold mt-auto ${missingField ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 transition duration-300 mt-auto"}`}>
                    Complete Payment
                </button>
            </form>
        </div>
        </>
    )
}