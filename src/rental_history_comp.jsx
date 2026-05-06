export function Pending({list}){
    return(
        <>
        <div className="flex flex-col h-fit w-full p-2.5 box-border justify-center items-center">
            <h1>Pending Requests</h1>
        {list.map((requests) => (
            <div key={requests.request_id} className="w-[90vw] h-fit min-h-[35vh] bg-amber-400 border p-5 flex">
                <img src={`http://localhost/vnm-system1-copy/php/cars/uploads/cars/${requests.image}`} alt="" className="w-[20%] aspect-auto" />
                <div className="flex flex-col w-[35%] h-[95%] bg-green-200">
                    <p>{requests.model}</p>
                    <p>{requests.rental_duration_days}</p>
                    <p>{requests.total_cost}</p>
                    <p>{requests.rental_date}</p>
                </div>
            </div>
        ))}
        </div>
        </>
    )
}

export function Active({list}){

}

export function Cancelled ({list}){
    
}