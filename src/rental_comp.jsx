import { useLocation } from "react-router-dom"

export function RentalForm(){
    const loc = useLocation();
    const carDetails = loc.state?.car;
    return(
        <div className="w-100% h-screen bg-white rounded-xl shadow-lg flex items-center justify-center p-7.5">
            <div className="w-[40%] h-full">
                <img src={`http://localhost/vnm-system1-copy/php/cars/uploads/cars/${carDetails?.image}`} alt="" className="w-full h-full overflow-hidden object-cover"/>
            </div>
            <div className="w-[60%] h-full px-7.5">
                <p className="text-center text-3xl font-bold w-full ">{carDetails?.model}</p>
                <p>Daily Rate: {carDetails?.daily_rate}</p>
            </div>
        </div>
    )
}