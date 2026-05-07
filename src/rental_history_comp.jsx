export function Rental_History_Block({type, list}){

    return(
        <>
        <div className="flex flex-col h-fit w-full p-2.5 box-border justify-center items-center">
            <h1 className="text-2xl font-bold mb-2.5">{type}</h1>
            {list.length === 0 ? (
                <div className="flex flex-col w-[90vw] h-[15vh] rounded-2xl border border-gray-600/35">
                    <h1 className="text-xl text-black/50 m-auto">No History To Show</h1>
                </div>
            ) : (
                <div className="flex flex-col w-[90vw] h-fit rounded-2xl border border-gray-600/35">
                    {list.map((requests)=>{
                        const pickupDate = new Intl.DateTimeFormat('en-US', {
                            year: "numeric",
                            month: "long",
                            day: '2-digit'
                        }).format(new Date(requests.rental_date))

                        const returnDate = new Date(requests.rental_date)
                        returnDate.setDate(
                            returnDate.getDate() + (parseInt(requests.rental_duration_days)-1)
                        )
                        const return_date = new Intl.DateTimeFormat('en-US', {
                            year: "numeric",
                            month: "long",
                            day: '2-digit'
                        }).format(returnDate)

                        return(
                            <div key={requests.request_id} className="w-full h-fit min-h-[35vh] bg-white-400 p-5 flex border-b border-b-gray-600/50 last:border-b-0">

                            <img src={`http://localhost/vnm-system1-copy/php/cars/uploads/cars/${requests.image}`} alt="" className="w-[20%] aspect-auto"/>

                            <div className="flex flex-col w-[35%] h-100% p-3 justify-around">
                                <p className=" text-xl font-bold w-full">{requests.model}</p>
                                <p><b>Duration: </b>{requests.rental_duration_days}</p>
                                <p><b>Price: </b> {requests.total_cost}</p>
                                <p><b>Pickup Date: </b> {pickupDate}</p>
                                <p><b>Return Date: </b> {return_date}</p>
                            </div>

                            <div className="ml-auto h-100% w-fit flex items-center justify-center">
                                <button 
                                    className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-black text-white font-bold rounded-lg text-l hover:scale-[1.075]" >
                                    Cancel
                                </button>  
                            </div>

                        </div>
                        )
                    })}
                </div>
                )}
        </div>
        </>
    )
}