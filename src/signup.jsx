import { useState, useEffect } from "react"
import axios from "axios"

export function Signup({ setNavDisplay }) {
    useEffect(() => {
        setNavDisplay(false)
        return () => setNavDisplay(true)
    },[])

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [licenseNumber, setLicenseNumber] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const clearField = () => {
        setFullName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setPhone("")
        setLicenseNumber("")
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        if (!fullName || !email || !password || !confirmPassword || !phone || !licenseNumber) {
            setError("Please fill all fields")
            return
        } else if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        } else {
           try {
            const response = await axios.post('http://localhost/Car-Rental-Website/back/login_signup.php', {
                action: "signup",
                fullName: fullName,
                email: email,
                password: password,
                phone: phone, 
                licenseNumber: licenseNumber
            })

            const stat = response.data.signup
            if(stat === "1"){
                setError("Full name must include first and last name.")
                clearField()
            } else if (stat === "2"){
                setError("Full name must contain letters only.")
                clearField()
            } else if (stat === "3"){
                setError("Full name is too short.")
                clearField()
            } else if (stat === "4"){
                setError("Invalid email format.")
                clearField()
            } else if (stat === "5"){
                setError("Password must be 8–20 characters.")
                clearField()
            } else if (stat === "6"){
                setError("Invalid license format. Expected: ABC 123 or ABC 1234.")
                clearField()
            } else if (stat === "7"){
                setError("Email already exists!")
                clearField()
            } else if (stat === "success"){
                setSuccess("Account created successfully! You can now log in.")
                clearField()
            } else if (stat === "8"){
                setError("Failed to create account.")
                clearField()
            }
            
           } catch (error) {
            setError("Connection error. Make sure Apache and MySQL are running.")
           }
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
                    <h2 className="text-3xl font-bold text-center mb-2">MLT Car Rental</h2>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSignup}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Full Name</label>
                            <input 
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Phone Number</label>
                            <input 
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter your phone number"
                                pattern="[0-9]{4} [0-9]{3} [0-9]{4}"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">License Number</label>
                            <input 
                                type="text"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter your driver's license number"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Password</label>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">Confirm Password</label>
                            <input 
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Confirm your password"
                            />
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300"
                        >
                            Sign Up
                        </button>
                    </form>

                    <div className="mt-6 text-center border-t pt-6">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <a 
                                href="/login" 
                                className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition duration-300"
                            >
                                Sign in here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}