import { Rental_History_Block } from "./rental_history_comp";
import { useState, useEffect } from "react";
import axios from "axios";

export function Rental_History(){
    const [history, setHistory] = useState({history: [], active:[]})
    useEffect(()=>{
        const getHistory = async ()=>{
            const response = await axios.get("http://localhost/Car-Rental-Website/back/rental_history.php")
            setHistory(response.data)
        }
        getHistory()
    }, [])

    const history_list = history.history || []
    const pending = history_list.filter(request => request.request_status === 'Pending' || (request.request_status === 'Approved' && request.payment_status === 'Unpaid'))
    const approved = history_list.filter(request => request.request_status === 'Approved' && request.payment_status=== 'Paid')
    const cancelled = history_list.filter(request => request.request_status === 'Cancelled')
    const paid = history_list.filter(request => request.payment_status === 'Proof Uploaded')

    const active_list = history.active || []
    const active = active_list

    return(
        <>
        <Rental_History_Block type="Active" list={active}/>
        <Rental_History_Block type="Paid" list={paid}/>
        <Rental_History_Block type="Pending" list={pending}/>
        <Rental_History_Block type="Approved" list={approved}/>
        <Rental_History_Block type="Cancelled" list={cancelled}/>
        </>
    )
}