import { useEffect, useState } from "react";
import { RentalForm } from "./rental_comp";
import { useNavigate } from "react-router-dom";

export function Rental_page({setNavDisplay}){
    useEffect(()=>{setNavDisplay(false)})
    return(
        <>
        <RentalForm/>
        </>
    )
}