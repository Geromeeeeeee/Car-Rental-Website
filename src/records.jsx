import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config";

export function useRecords (){
    const [records, setRecords] = useState({history: [], active:[]})

    const getRecords = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/back/rental_history.php`)
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