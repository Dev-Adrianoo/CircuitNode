import MenuHamburguer from "@/ui/menuhamburguer";

interface HeaderProps{

      onToggle: ()=> void ;
}

export default function Header( {onToggle} : HeaderProps) {
  return (
    <>
      <div className="flex flex-grow max-h-16 h-16 relative bg-custom-lightblue">
        <div className="bg-custom-lightblue text-white font-inter font-bold text-2xl px-4 py-3 w-full h-full ml-10 flex items-center">
          CIN
        </div>

        <div className="z-40  font-light text-black absolute left-0 right-0 top-1/2 transform -translate-y-1/2 text-xl justify-self-center">
          <p
            contentEditable
            className="outline-transparent border-transparent font-medium">
              label work flow name
          </p>
        </div>
       
        <div className="mb-3 bg-teal-10 w-full border-b-">
          <div className=" absolute mt-3 left-40 justify-self-center w-300 
           h-0 border-l-50 bg-custom-blue-border-l  border-solid border-2 border-r-transparent border-b-50 bg-custom-whitesh-border">
          </div>
          
          <div className="absolute left-34.5 w-305 mt-[-1.8rem] justify-self-center h-0 border-l-50 bg-blue-custom-border-l  border-solid border-2 
          border-r-transparent border-b-50 border-b-white">
            
          </div>
        </div>
           <MenuHamburguer onToggle={onToggle} />
      </div>
    </>
  );
}
