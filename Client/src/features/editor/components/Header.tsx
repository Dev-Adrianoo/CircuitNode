import MenuHamburguer from "@/ui/menuhamburguer";


interface HeaderProps {
  onToggle: () => void;
}

export default function Header({ onToggle }: HeaderProps ) {
  return (
    <>
      <div className="flex flex-grow max-h-16 h-16 bg-gradient-to-r via-100% via-blue-950 from-45%  relative bg-custom-lightblue">
        <div className=" text-white font-inter font-bold text-2xl px-4 py-3 w-full h-full ml-10 flex items-center ">
          CNode
        </div>

        <div className="font-light text-black absolute left-0 right-0 top-1/2 transform -translate-y-1/2 text-xl justify-self-center">
          <p
            contentEditable

            className="outline-transparent  text-white border-transparent font-medium"
          >
            Workflow title
          </p>
        </div>
       
       
        <div className="flex mt-4 mr-4 justify-self-end self-center items-center">
          <MenuHamburguer onToggle={onToggle} />
        </div>
      </div>
    </>
  );
}
