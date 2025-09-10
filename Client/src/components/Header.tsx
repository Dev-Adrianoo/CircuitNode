import { Menu } from "lucide-react";
import MenuHamburguer from "./ui/menuhamburguer";


interface HeaderProps{

      onToggle: ()=> void ;
}

export default function Header( {onToggle} : HeaderProps) {
  return (
    <>
      <div className="flex flex-grow max-h-16 h-16 relative">
        <div className="bg-gray-800 text-white font-medium px-4 py-3 w-full h-full flex items-center">
          CircuitNode
        </div>

        <div className="z-40 font-light text-black absolute left-0 right-0 top-1/2 transform -translate-y-1/2 text-xl justify-self-center">
          <p
            contentEditable
            className="outline-transparent border-transparent font-semibold">
              label work flow name
          </p>
        </div>
       
        <div className="mb-3 bg-white w-full ">
          <div className="absolute left-40 justify-self-center w-300 
           h-0 border-l-50 border-solid border-2 border-r-transparent border-b-50 border-b-white">
          </div>
          
          <div className="absolute left-35 w-305 mt-[-2.5rem] justify-self-center h-0 border-l-50 border-solid border-2 border-r-transparent border-b-50 border-b-white">
            
          </div>
        </div>
           <MenuHamburguer onToggle={onToggle} />
      </div>
    </>
  );
}
