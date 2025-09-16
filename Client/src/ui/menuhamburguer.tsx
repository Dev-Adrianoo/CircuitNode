import { Menu } from "lucide-react";
import React, { useState } from "react";

interface menuhamburguerProps {
  onToggle: () => void;
}
const MenuHamburguer: React.FC<menuhamburguerProps> = ({ onToggle }) => {
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    setIsClicked(true);
  };
 
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
