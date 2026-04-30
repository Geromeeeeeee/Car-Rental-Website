import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

export function Nav({navDisplay, logged, setLog}){
    const [logOutDisp, setLogoutDisp] = useState(false)
    const navigate = useNavigate()
    const logOut = async () => {
        await axios.post('http://localhost/Car-Rental-Website/back/login_signup.php', {
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
        {navDisplay ? ( logged ? 
        //Nav bar kapag naka log in
            (
            <><nav className="w-full h-[12.5vh] flex justify-between items-center p-5 ">
            <div className="h-full w-[50%] flex items-center">
                <img src="/src/assets/MLT_logo.png" alt="Logo" className="h-[200%] aspect-square"/>
                <div className="flex space-x-6 ml-10">
                    <Link to={"/"} className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Home</Link>
                    <a href="#" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Cars</a>
                    <a href="#About" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">About</a>
                    <a href="#" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Rental History</a>
                </div>
            </div>
            
            <div className="log-in w-fit h-full">
                <button 
                className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-black text-white font-bold rounded-lg text-l hover:scale-[1.075]" 
                onClick={logOutModal}>
                Logout
                </button>
            </div>
        </nav>
        {logOutDisp ? (
            <div className="w-full h-screen flex justify-center items-center z-1 fixed inset-0">
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
        ) : (
            null
        )}
        </>
        ) : 
        //Nav bar kapag naka log-out
        (<nav className="w-full h-[12.5vh] flex justify-between items-center p-5 ">
            <div className="h-full w-[50%] flex items-center">
                <img src="/src/assets/MLT_logo.png" alt="Logo" className="h-[200%] aspect-square"/>
                <div className="flex space-x-6 ml-10">
                    <Link to={"/"} className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Home</Link>
                    <a href="#About" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">About</a>
                    <a href="#" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Cars</a>
                </div>
            </div>
        
            <div className="log-in w-fit h-full">
                <button 
                className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-black text-white font-bold rounded-lg text-l hover:scale-[1.075]" 
                onClick={()=>navigate("/login")}>
                Login/Signup
                </button>
            </div>
        </nav>)
        ) : (
            null
        )}
        </>
    )
} 