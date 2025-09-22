import { Menu } from "lucide-react";
import React from "react";

interface menuhamburguerProps {
  onToggle: () => void;
}
const MenuHamburguer: React.FC<menuhamburguerProps> = ({ onToggle }) => {
 
  return (
    <>
      <div className={` flex justify-center justify-self-center h-10 w-10 `}>
        <Menu
          onClick={onToggle}
          size={25}
          color="white"
          className={`  cursor-pointer transtion-all duration-100 transform `}
        />
      </div>    
    </>
  );
};
export default MenuHamburguer;
