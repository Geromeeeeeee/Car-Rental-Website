export function Nav(){
    return(
        <>
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
            
            <div className="log-in w-fit h-full">
                <button className="log-in w-[fit] h-[fit] p-2.5 transition duration-150ms ease-in-out bg-black text-white font-bold rounded-lg text-l hover:scale-[1.075]">Login/Signup</button>
            </div>
        </nav>
        </>
    )
}

export function Home(){
    return(
        <>
        <main className="">
        
        </main>    
        </>
    )
}