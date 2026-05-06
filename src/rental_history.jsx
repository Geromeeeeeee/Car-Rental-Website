import { Pending, Active, Cancelled } from "./rental_history_comp";
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
            <Pending list={pending}/>
            <Active list={active}/>
            <Cancelled list={cancelled}/>
        </>
    )
}