import MenuHamburguer from "@/ui/menuhamburguer";

interface HeaderProps {
  onToggle: () => void;
}

export default function Header({ onToggle }: HeaderProps) {
  return (
    <>
      <div className="flex flex-grow rounded-b-sm border-b  p-4 max-h-17 bg-gradient-to-b from-gray-800 to-gray-900  relative">
        <div className="text-white font-inter font-bold text-2xl px-4 py-3 w-full h-full ml-10 flex items-center ">
          CNode
        </div>

        <div className="font-light border-black absolute left-0 right-0 top-1/2 transform -translate-y-1/2 text-xl justify-self-center">
          <p
            contentEditable
            className="flex justify-center items-center outline-transparent max-w-100 w-100 text-white font-medium  rounded-sm border bg-gray-700 p-2 border-gray-500 shadow-md"
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
