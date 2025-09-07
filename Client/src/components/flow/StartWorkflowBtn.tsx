import svg from "../../assets/power-material2.svg"

export default function StartButton(){
    return(

       <div
        className=" flex-grow gap-5 items-center p-2 flex h-12 w-32  font-bold text-gray-700 justify-center absolute right-0 bottom-[-1.5rem] mb-10 mr-10 bg-gray-100 rounded-md  cursor-pointer z-50 border-solid border-transparent border-2 hover:border-blue-300 ">
        Ativar
        <img src={svg} className=" h-8 w-8 "
        ></img>

       </div>     
    )
}