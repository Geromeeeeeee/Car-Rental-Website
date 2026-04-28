import { useLocation } from "react-router-dom"

export function RentalForm(){
    const loc = useLocation();
    const carDetails = loc.state?.car;
    return(
        <div>
            <p>{carDetails?.model}</p>
            <p>{carDetails?.daily_rate}</p>
            <p>{carDetails?.description}</p>
        </div>
    )
}