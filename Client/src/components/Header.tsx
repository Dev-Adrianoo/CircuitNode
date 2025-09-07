

export default function Header(){
    return(
       <>
       <div className="flex  flex-grow max-h-16 justify-left h-16  ">

         <div className="bg-conic-120 bg-gray-800 text-white font-medium p-3 w-full h-full flex items-center">
            CircuitNode
         </div>
         <div className="bg-white justify-self-center">
           <div className="z-40 flex font-light text-black  absolute left-0 right-0 mt-5 text-xl justify-self-center  "><p contentEditable className="outline-transparent ">label work flow name</p></div>
         </div> 
         <div className="mt-3 bg-white w-full ">
           <div className="absolute left-40 justify-self-center w-300
           h-0 border-l-50 border-solid border-2 border-r-transparent border-b-50 border-b-white"></div>
           <div className="absolute left-35 w-305 mt-[-2.5rem] justify-self-center  h-0 border-l-50 border-solid border-2 border-r-transparent border-b-50 border-b-white"></div>
         </div>
        </div>  
       </>
    )

}