import svg from "@/assets/power-material-svgrepo-com.svg";
import loadingSVG from "@/assets/loading-svgrepo-com.svg";
interface StartButtonProps {
  onClick: () => void;
  isSimulating: boolean;
}

export default function StartButton({
  onClick,
  isSimulating,
}: StartButtonProps) {
  return (
    <div
      className=" flex-grow gap-5 items-center p-2 flex h-12 w-32  text-gray-700 justify-center absolute right-0 bottom-[-1.5rem] mb-10 mr-10 bg-gray-100 rounded-md  cursor-pointer z-50 border-solid border-transparent border-2   hover:border-blue-300 hover:shadow-[0px_0px_10px_2.5px_rgba(37,99,235,0.7)] font-medium transition-all "
      onClick={onClick}
    >
      {isSimulating ? "Simulando" : "Simular"}
      {isSimulating ? (
        <span>
          <img src={loadingSVG} className={` h-6 w-6  animate-spin `} />
        </span>
      ) : (
        <span>
          <img src={svg} className={`h-6 w-6 `} />
        </span>
      )}
    </div>
  );
}
