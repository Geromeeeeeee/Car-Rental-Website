import { useState } from "react"

//please anong magandang color T.T
export function Nav(){
    return(
        <nav className="w-full h-[12.5vh] flex justify-between items-center p-5 ">
            <div className="h-full w-[50%] flex items-center">
                <img src="/src/assets/MLT_logo.png" alt="Logo" className="h-[200%] aspect-square"/>
                <div className="flex space-x-6 ml-10">
                    <a href="#" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Home</a>
                    <a href="#" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">About</a>
                    <a href="#" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Cars</a>
                    <a href="#" className="hover:text-gray-500 text-xl px-3 py-2 rounded-lg hover:shadow-md hover:bg-gray-100 transition-all duration-300">Contact</a>
                </div>
            </div>
            
            <div className="log-in w-fit h-full flex gap-3">
                <a href="/login">
                    <button className="px-9 py-4.5 bg-black text-white font-bold rounded-lg hover:scale-[1.075] transition duration-150">Login</button>
                </a>
                <a href="/signup">
                    <button className="px-9 py-4.5 bg-blue-600 text-white font-bold rounded-lg hover:scale-[1.075] transition duration-150">Signup</button>
                </a>
            </div>
        </nav>
    )
}

export function Login(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = (e) => {
        e.preventDefault()
        if(!email || !password){
            setError("Please fill all fields")
            return
        }
        console.log("Login:", {email, password})
    }

    return(
        <>
            <Nav/>
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
                            <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300"
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
        </>
    )
}