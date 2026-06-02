import {useNavigate} from "react-router-dom"

export function PopUp({show, message, type}){
    const nav = useNavigate()
    return(
        <>
        <div className={`fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center transition-opacity z-50 ${show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={()=>nav("/")}>
            <div className="bg-white rounded-lg shadow-lg w-[35vw] h-[35vh] overflow-clip flex flex-col">
            <div className={`w-full h-fit p-2.5 ${type==='Success' ? 'bg-green-500' : 'bg-red-500'}`}>
            <h1 className="font-semibold text-white text-xl">{type}!</h1>
            </div>
            <div className="flex grow text-black/80 p-2.5 justify-center items-center text-center text-lg">
                {message}
            </div>
            </div>
        </div>
        </>
    )
}