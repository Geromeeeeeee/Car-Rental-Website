import { Rental_History_Block } from "./rental_history_comp";
import { useRecords } from "./records";

export function My_Rentals(){
    const {records} = useRecords()
    const history_list = records.history || []
    const active_list = records.active || []

    const pending = history_list.filter(request => 
        request.request_status === "Pending" ||
        request.request_status === "Approved" && (
            request.payment_status === "Unpaid" ||
            request.payment_status === "Downpayment Reupload Required" ||
            request.payment_status === "Final Reupload Required"
        )
    )

    const forApproval = history_list.filter(request =>
        request.payment_status === 'Downpayment Proof Uploaded' || 
        request.payment_status === 'Final Proof Uploaded'
    )

    const approved = history_list.filter(request => 
        request.request_status === 'Approved' && 
        (request.payment_status=== 'Fully Paid' || request.payment_status === 'Downpayment Verified'))
    
    const active = history_list.filter(request => 
        request.request_status === 'Picked Up' || 
        request.request_status === 'Early Return Requested' || 
        request.request_status === 'Early Return Approved' || 
        request.request_status === 'Return Requested' || 
        request.request_status === 'Return Approved' || 
        request.request_status === 'Late Return Requested' || 
        request.request_status === 'Late Return Approved'
    )

    return(
        <>
        <Rental_History_Block type="Active" list={active}/>
        <Rental_History_Block type="Verification Pending" list={forApproval}/>
        <Rental_History_Block type="Pending" list={pending}/>
        <Rental_History_Block type="Approved" list={approved}/>
        </>
    )
}