import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export function Login({ setNavDisplay, setLog }) {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const [showForgotModal, setShowForgotModal] = useState(false)
    const [forgotStep, setForgotStep] = useState(1) // 1 = Email, 2 = OTP, 3 = Password
    const [modalError, setModalError] = useState("")
    const [resetSuccess, setResetSuccess] = useState(false)
    const [forgotData, setForgotData] = useState({ email: "", otp: "", newPass: "", confirmPass: "" })

    const [isSending, setIsSending] = useState(false)
    const [timer, setTimer] = useState(0)
    useEffect(() => {
        let interval = null
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
        } else {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [timer])

    useEffect(() => {
        setNavDisplay(false)
        return () => setNavDisplay(true)
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setForgotData(prev => ({ ...prev, [name]: value }))
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!email || !password) return setError("Please fill all fields")
        try {
            const response = await axios.post('http://localhost/Car-Rental-Website/back/login_signup.php', { action: "login", email, password }, { withCredentials: true })
            if (response.data.stat === "logged") {
                localStorage.setItem("loggedIn", "true")
                setLog(true)
                navigate("/")
            } else {
                setError(response.data.stat === "failed" ? "Incorrect Details" : "Account Not Found")
                setEmail(""); setPassword("")
            }
        } catch (err) { setError("Connection error") }
    }

    //Request OTP (Dito isiningit ung Loading nd Timer)
    const handleForgotPassword = async (e) => {
        e.preventDefault()
        if (!forgotData.email) return
        
        setModalError("")
        setIsSending(true)

        try {
            const response = await axios.post('http://localhost/Car-Rental-Website/back/login_signup.php', { 
                action: "forgot_password_request", 
                email: forgotData.email 
            })
            
            if (response.data.status === "otp_generated") {
                setTimer(60)
                setForgotStep(2)
            } else {
                setModalError(response.data.status === "email_not_found" ? "Account Not Found" : "Something went wrong")
            }
        } catch (err) { 
            setModalError("Connection error") 
        } finally {
            setIsSending(false) 
        }
    }
    //for resend button
    const handleResendOtp = async () => {
        if (!forgotData.email || isSending) return
        
        setModalError("")
        setIsSending(true)

        try {
            const response = await axios.post('http://localhost/Car-Rental-Website/back/login_signup.php', { 
                action: "forgot_password_request", 
                email: forgotData.email 
            })
            
            if (response.data.status === "otp_generated") {
                setTimer(60)
            } else {
                setModalError("Failed to resend code. Please try again.")
            }
        } catch (err) { 
            setModalError("Connection error during resend") 
        } finally {
            setIsSending(false)
        }
    }

    // Verify OTP muna
    const handleVerifyOtpOnly = async (e) => {
        e.preventDefault()
        if (!forgotData.otp) return
        setModalError("")
        try {
            const response = await axios.post('http://localhost/Car-Rental-Website/back/login_signup.php', { action: "verify_otp_only", email: forgotData.email, otp: forgotData.otp })
            if (response.data.status === "otp_valid") setForgotStep(3)
            else setModalError(response.data.status === "invalid_otp" ? "Incorrect Code or Expired" : "Verification failed")
        } catch (err) { setModalError("Connection error") }
    }

    //Reset Password
    const handleResetPasswordFinal = async (e) => {
        e.preventDefault()
        if (!forgotData.newPass || !forgotData.confirmPass) return
        setModalError("")
        if (forgotData.newPass !== forgotData.confirmPass) return setModalError("Passwords do not match")
        try {
            const response = await axios.post('http://localhost/Car-Rental-Website/back/login_signup.php', { action: "verify_otp_and_reset", email: forgotData.email, otp: forgotData.otp, password: forgotData.newPass })
            if (response.data.status === "success") setResetSuccess(true)
            else setModalError(response.data.status === "invalid_otp" ? "Session expired or invalid OTP" : "Failed to update password")
        } catch (err) { setModalError("Connection error") }
    }

    const closeModal = () => {
        setShowForgotModal(false)
        setForgotData({ email: "", otp: "", newPass: "", confirmPass: "" })
        setForgotStep(1); setModalError(""); setResetSuccess(false)
        setTimer(0) //reset yung timer kapag sinara yung modal
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center mb-2">Welcome To</h2>
                    <h2 className="text-3xl font-bold text-center mb-2">MLT Car Rental</h2>
                    {error && <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter your email" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" placeholder="Enter your password" />
                        </div>
                        <div className="flex justify-end mb-6">
                            <button type="button" onClick={() => setShowForgotModal(true)} className="text-blue-600 hover:underline focus:outline-none">Forgot password?</button>
                        </div>
                        <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300">Sign In</button>
                    </form>
                    <div className="mt-6 text-center border-t pt-6">
                        <p className="text-gray-600">Don't have an account yet? <a href="/signup" className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition duration-300">Sign up here</a></p>
                    </div>
                </div>
            </div>

            {showForgotModal && (
                <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-2xl font-bold text-gray-800">Reset Password</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 focus:outline-none text-2xl">×</button>
                        </div>
                        <div className="p-6">
                            {modalError && <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{modalError}</div>}
                            {!resetSuccess ? (
                                <>
                                    {forgotStep === 1 && (
                                        <form onSubmit={handleForgotPassword}>
                                            <p className="text-gray-600 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
                                            <input type="email" name="email" value={forgotData.email} onChange={handleInputChange} placeholder="Enter your email" className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600" required />
                                            <div className="flex gap-3">
                                                <button 
                                                    type="submit" 
                                                    disabled={isSending}
                                                    className={`flex-1 text-white py-3 rounded-lg font-bold transition duration-300 ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-700'}`}
                                                >
                                                    {isSending ? "Sending Code..." : "Send Code"}
                                                </button>
                                                <button type="button" onClick={closeModal} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition duration-300">Cancel</button>
                                            </div>
                                        </form>
                                    )}
                                    {forgotStep === 2 && (
                                        <form onSubmit={handleVerifyOtpOnly}>
                                            <p className="text-gray-600 mb-4 text-sm text-center">Enter the 6-digit code to verify your account.</p>
                                            <input type="text" name="otp" maxLength="6" value={forgotData.otp} onChange={handleInputChange} placeholder="Enter 6-digit OTP code" className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-blue-600 text-center font-bold tracking-widest text-lg" required />
                                            <div className="text-center mb-5 text-sm">
                                                {timer > 0 ? (
                                                    <p className="text-gray-500">Didn't receive the code? Resend in <span className="font-bold text-blue-900">{timer}s</span></p>
                                                ) : (
                                                    <p className="text-gray-600">
                                                        Didn't receive the code?{" "}
                                                        {/* Inilipat natin sa bagong handleResendOtp function para isolated ang context */}
                                                        <button type="button" onClick={handleResendOtp} disabled={isSending} className="text-blue-600 font-bold hover:underline focus:outline-none disabled:text-gray-400">
                                                            {isSending ? "Sending..." : "Resend Code"}
                                                        </button>
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-3">
                                                <button type="submit" className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300">Verify Code</button>
                                                <button type="button" onClick={() => setForgotStep(1)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition duration-300">Back</button>
                                            </div>
                                        </form>
                                    )}
                                    {forgotStep === 3 && (
                                        <form onSubmit={handleResetPasswordFinal}>
                                            <p className="text-gray-600 mb-4 text-sm">Code verified successfully! You can now create your new password.</p>
                                            <input type="password" name="newPass" value={forgotData.newPass} onChange={handleInputChange} placeholder="Enter New Password" className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-blue-600" required />
                                            <input type="password" name="confirmPass" value={forgotData.confirmPass} onChange={handleInputChange} placeholder="Confirm New Password" className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-600" required />
                                            <div className="flex gap-3">
                                                <button type="submit" className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300">Update Password</button>
                                                <button type="button" onClick={closeModal} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition duration-300">Cancel</button>
                                            </div>
                                        </form>
                                    )}
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="mb-6">
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">Success!</h4>
                                        <p className="text-gray-600">Your password has been reset successfully. You can now log in using your new credentials.</p>
                                    </div>
                                    <button onClick={closeModal} className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300">Close</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}