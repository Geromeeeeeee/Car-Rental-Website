import { Rental_History_Block } from "./rental_history_comp";
import { useRecords } from "./records";
import { Rental_History_Table } from "./rental_history_comp_copy";
import { Rental_Buttons } from "./rental_history_buttons";

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
        {active.length > 0 && (
            <Rental_History_Table type="Active" list={active} />
        )}

        {forApproval.length > 0 && (
            <Rental_History_Table type="Verification Pending" list={forApproval} />
        )}

        {pending.length > 0 && (
            <Rental_History_Table type="Pending" list={pending} />
        )}

        {approved.length > 0 && (
            <Rental_History_Table type="Approved" list={approved} />
        )}

        {active.length === 0 && forApproval.length === 0 && pending.length === 0 && approved.length === 0 && (
            <div className="flex w-[90vw] h-[15vh] border border-gray-600/25 rounded-2xl m-auto mt-10">
                <h1 className="text-xl text-black/50 m-auto">No rental history found.</h1>
            </div>
        )}
        </>
    )
}