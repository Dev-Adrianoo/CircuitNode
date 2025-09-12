import { Menu } from "lucide-react";
import React from "react";

interface menuhamburguerProps{

      onToggle : () => void;

}
const MenuHamburguer: React.FC<menuhamburguerProps> = ({onToggle} )=> {
    
    return(
        <>
            <div className={`absolute right-3 mt-4 h-10 w-10`}><div onClick={onToggle}><Menu size={25} color="white"/> </div>          
            </div>
     
        </> 
    )
}
export default MenuHamburguer;