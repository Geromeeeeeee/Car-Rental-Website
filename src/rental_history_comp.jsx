export function Pending({list}){
    return(
        <>
        <div className="flex flex-col h-fit w-full p-2.5 box-border justify-center items-center">
            <h1 className="text-2xl font-bold mb-2.5">Pending Requests</h1>

            <div className="flex flex-col w-[90vw] h-fit rounded-2xl border border-gray-600/35">
                {list.map((requests) => (
                    <div key={requests.request_id} className="w-full h-fit min-h-[35vh] bg-white-400 p-5 flex border-b border-b-gray-600/50 last:border-b-0">
                        <img src={`http://localhost/vnm-system1-copy/php/cars/uploads/cars/${requests.image}`} alt="" className="w-[20%] aspect-auto" />
                        <div className="flex flex-col w-[35%] h-[95%] p-3">
                            <p className=" text-xl font-bold w-full">{requests.model}</p>
                            <p><b>Duration: </b>{requests.rental_duration_days}</p>
                            <p><b>Price: </b> {requests.total_cost}</p>
                            <p><b>Pickup Date: </b> {requests.rental_date}</p>
                        </div>
                        <div className="ml-auto h-[95%] w-fit flex items-center justify-center bg-amber-300">
                          <button 
                className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-black text-white font-bold rounded-lg text-l hover:scale-[1.075]" >
                Cancel
                </button>  
                        </div>
                    </div>
                ))}
            </div>
        
        </div>
        </>
    )
}

export function Active({list}){

}

export function Cancelled ({list}){
    
}