import { Rental_History_Block } from "./rental_history_comp";
import { useState, useEffect } from "react";
import axios from "axios";

export function Rental_History(){
    const [history, setHistory] = useState([])
    useEffect(()=>{
        const getHistory = async ()=>{
            const history = await axios.get("http://localhost/Car-Rental-Website/back/rental_history.php")
            setHistory(history.data)
        }
        getHistory()
    }, [])

    const pending = history.filter(request => request.request_status === 'Pending')
    const active = history.filter(request => request.request_status === 'Approved')
    const cancelled = history.filter(request => request.request_status === 'Cancelled')
    return(
        <>
            <Rental_History_Block type="Pending" list={pending}/>
            <Rental_History_Block type="Active" list={active}/>
            <Rental_History_Block type="Cancelled" list={cancelled}/>
        </>
    )
}