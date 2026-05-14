import { Rental_History_Block } from "./rental_history_comp";
import { useRecords } from "./records";

export function Rental_History(){
    const {records} = useRecords()
    const history_list = records.history || []

    const cancelled = history_list.filter(request => request.request_status === 'Cancelled')
    const completed = history_list.filter(request => request.request_status === 'Returned')
    return(
        <>
        <Rental_History_Block type={"Completed"} list={completed}/>
        <Rental_History_Block type={"Cancelled"} list={cancelled}/>
        </>
    )
}