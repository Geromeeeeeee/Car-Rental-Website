import { Rental_History_Block } from "./rental_history_comp";
import { useRecords } from "./records";

export function My_Rentals(){
    const {records} = useRecords()
    const history_list = records.history || []
    const active_list = records.active || []

    const pending = history_list.filter(request => request.request_status === 'Pending' || (request.request_status === 'Approved' && request.payment_status === 'Unpaid'))
    const approved = history_list.filter(request => request.request_status === 'Approved' && request.payment_status=== 'Paid')
    const paid = history_list.filter(request => request.payment_status === 'Proof Uploaded')
    const active = active_list.filter(active=>active.request_status!='Returned')

    return(
        <>
        <Rental_History_Block type="Active" list={active}/>
        <Rental_History_Block type="Paid" list={paid}/>
        <Rental_History_Block type="Pending" list={pending}/>
        <Rental_History_Block type="Approved" list={approved}/>
        </>
    )
}