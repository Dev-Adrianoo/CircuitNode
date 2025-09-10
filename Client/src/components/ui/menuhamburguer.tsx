import { Menu } from "lucide-react";
import { useState } from "react";
import React from "react";

interface menuhamburguerProps{

      onToggle : () => void;

}
const MenuHamburguer: React.FC<menuhamburguerProps> = ({onToggle} )=> {
    
    const [isClicked,setIsClicked] = useState(false);
    const handleClick= () =>{

        setIsClicked(!isClicked)
    }
    return(
        <>
            <div className={`absolute right-0 mt-4 h-10 w-10 ${isClicked ? '':''}`}><div onClick={handleClick}><Menu onClick={onToggle} size={25} color="black"/> </div>          
            </div>
     
        </> 
    )
}
export default MenuHamburguer;