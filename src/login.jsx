import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

// please anong magandang color T.T

export function Login({setNavDisplay}){
    const navigate = useNavigate()

    useEffect(()=>{
        setNavDisplay(false)
        return()=>setNavDisplay(true)
    }, [])

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    
    // Forgot password modal states
    const [showForgotModal, setShowForgotModal] = useState(false)
    const [resetEmail, setResetEmail] = useState("")
    const [resetSuccess, setResetSuccess] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        if(!email || !password){
            setError("Please fill all fields")
            return
        }
        
        try {
            const response = await axios.post('http://localhost/Car-Rental-Website/Back/login_signup.php', {
                action: "login",
                email: email,
                password: password
            })
            
            const status = response.data.stat 
            if(status === "logged"){
                navigate("/")
            } else if (status === "failed"){
                setError("Incorrect Details")
                setEmail("")
                setPassword("")
            }
        } catch (err) {
            setError("Connection error")
        }
    }

    const handleForgotPassword = (e) => {
        e.preventDefault()
        if (!resetEmail) {
            return
        }
        setResetSuccess(true)
    }

    const closeModal = () => {
        setShowForgotModal(false)
        setResetEmail("")
        setResetSuccess(false)
    }

    return(
        <>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center mb-2">Welcome To</h2>
                    <h2 className="text-3xl font-bold text-center mb-2">MLT Car Rental</h2>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e)=> setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Password</label>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2"/>
                                <span className="text-gray-700">Remember me</span>
                            </label>
                            <button 
                                type="button"
                                onClick={() => setShowForgotModal(true)}
                                className="text-blue-600 hover:underline focus:outline-none"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 text-center border-t pt-6">
                        <p className="text-gray-600">
                            Don't have an account yet?{' '}
                            <a 
                                href="/signup" 
                                className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition duration-300"
                            >
                                Sign up here
                            </a>
                        </p>
                    </div>
                </div>
            </div>

          //Newlyadded Forgot Password Modal
            {showForgotModal && (
                <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                       //header ng modal
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-2xl font-bold text-gray-800">Reset Password</h3>
                            <button 
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6">
                            {!resetSuccess ? (
                                <form onSubmit={handleForgotPassword}>
                                    <p className="text-gray-600 mb-4">
                                        Enter your email address and we'll send you a link to reset your password.
                                    </p>
                                    
                                    <input 
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600"
                                        required
                                    />
                                    
                                    <div className="flex gap-3">
                                        <button 
                                            type="submit"
                                            className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300"
                                        >
                                            Send Reset Link
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={closeModal}
                                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition duration-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-center">
                                    <div className="mb-6">
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">Check your email</h4>
                                        <p className="text-gray-600">
                                            We've sent a password reset link to:<br />
                                            <span className="font-semibold text-gray-800">{resetEmail}</span>
                                        </p>
                                    </div>
                                    <button 
                                        onClick={closeModal}
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}