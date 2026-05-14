import { useState, useEffect } from "react";
import axios from "axios";

export function useRecords (){
    const [records, setRecords] = useState({history: [], active:[]})

    const getRecords = async () => {
        try {
            const response = await axios.get("http://localhost/Car-Rental-Website/back/rental_history.php")
            setRecords(response.data)
        } catch (error) {
            alert("Error")
        }
    }

    useEffect(()=>{
        getRecords();
    }, [])

    return{records, getRecords}
}