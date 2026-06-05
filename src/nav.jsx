import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import { API_BASE_URL } from "./config"
import {HashLink} from "react-router-hash-link"

export function Nav({navDisplay, logged, setLog, search, setSearch}){
    const [logOutDisp, setLogoutDisp] = useState(false)
    const navigate = useNavigate()
    const logOut = async () => {
        await axios.post(`${API_BASE_URL}/back/login_signup.php`, {
            action: "logout"
        }, { withCredentials: true })
        localStorage.removeItem("loggedIn")
        setLog(false)
        setLogoutDisp(false)
        navigate("/")
    }
    const logOutModal = () => {
        setLogoutDisp(true)
    }
    return(
        <>
        {logOutDisp && (
            <div className="w-full h-screen flex justify-center items-center z-50 fixed inset-0">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
                <div className="z-10 flex flex-col justify-evenly items-center w-[30%] h-[50%] bg-gray-100 rounded-3xl">
                    <div className="text-center">
                        <h1 className="text-[4vh] font-semibold">Log out?</h1>
                        <p>You are about to log out</p>
                    </div>
                    <div className="flex w-[75%] h-[25%] items-center justify-evenly">
                        <button className="w-[40%] h-[80%] bg-blue-500 hover:bg-blue-700 hover:text-white rounded-3xl" onClick={()=>{
                            setLogoutDisp(false)
                        }}>No</button>
                        <button className="w-[40%] h-[80%] bg-red-500 hover:bg-red-700 hover:text-white rounded-3xl" onClick={logOut}>Yes</button>
                    </div>
                </div>
            </div>
        )}
        {navDisplay ? (
            <>
            <nav className="w-full h-[12.5vh] flex justify-between items-center p-5 sticky top-0 bg-white z-25">
            <div className="h-full w-fit flex items-center">
                <img src="/MLT_logo.png" alt="Logo" className="h-[200%] aspect-square"/>
                <div className="flex space-x-6 ml-10">
                    <HashLink to="/#Home" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Home</HashLink>
                    <HashLink to="/#Cars" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Cars</HashLink>
                    <HashLink to="/#About" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">About</HashLink>
                    {logged && (
                    <>
                    <Link to={"/my_rentals"} className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">My Rentals</Link>
                    <Link to={"/rental_history"} className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Rental History</Link>
                    </>
                    )}
                </div>
            </div>
            <div className="mx-2.5  mr-auto">
                <input type="search" name="" id="" placeholder="Search" className="w-[full] h-[7.5vh] p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" value={search} onChange={(e)=>setSearch(e.target.value)}/>
            </div>
            <div className="log-in w-fit h-full">
                <button 
                className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-black text-white font-bold rounded-lg text-l hover:scale-[1.075]" 
                onClick={()=> logged ? logOutModal() : navigate("/login")}>
                {logged ? "Logout" : "Login/Signup"}
                </button>
            </div>
            </nav>
            </>
        ) : (
            null
        )}
        </>
    )
} 