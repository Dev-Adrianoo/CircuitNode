import svg from "@/assets/power-material-svgrepo-com.svg"

interface StartButtonProps {
    onClick: () => void;
    isSimulating: boolean;
}

export default function StartButton({onClick, isSimulating}: StartButtonProps){

    return(
       <div
        className=" flex-grow gap-5 items-center p-2 flex h-12 w-32  font-bold text-gray-700 justify-center absolute right-0 bottom-[-1.5rem] mb-10 mr-10 bg-gray-100 rounded-md  cursor-pointer z-50 border-solid border-transparent border-2 hover:border-blue-300 color-teste "
        onClick={onClick}
        >
        {isSimulating ? 'Simulando' : 'Simular'}
        <span>
            <img 
            src={svg} 
            className={`h-6 w-6 ${isSimulating ? 'animate-spin' : ''}`}
            />
        </span>
       </div>     
    )
}