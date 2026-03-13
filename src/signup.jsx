import { useState, useEffect } from "react"

export function Signup({ setNavDisplay }) {
    useEffect(() => {
        setNavDisplay(false)
        return () => setNavDisplay(true)
    })

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [licenseNumber, setLicenseNumber] = useState("")
    const [error, setError] = useState("")

    const handleSignup = (e) => {
        e.preventDefault()
        if (!fullName || !email || !password || !confirmPassword || !phone || !licenseNumber) {
            setError("Please fill all fields")
            return
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        console.log("Signup:", { fullName, email, password, phone, licenseNumber })
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