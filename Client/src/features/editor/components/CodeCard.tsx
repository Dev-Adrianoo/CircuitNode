import type { Response } from "@/service/compilerPayload";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type React from "react";
import { useEffect } from "react";

interface CodeCardProps{
    succeded: boolean;
    isLoading: boolean;
    error:FetchBaseQueryError | SerializedError | undefined;
    data: Response | undefined;
}

const CodeCard:React.FC<CodeCardProps> = ({succeded, isLoading, data, error}:CodeCardProps) =>{
    
      return( 
        <>
        <div className={`bg-white text-black  text-center h-full flex flex-col items-center  absolute top-0 left-0 z-10 transition-all duration-300 font-semibold text-1xl pt-2
            ${succeded ? "w-1/4" : "w-0"}
            `}>
        
        <div className={`${succeded ? "block" : "hidden"}`}>
            <h1 className="text-black ">Copie seu código para o Arduino</h1>
        {isLoading ? "Carregado" : "Carregando Aguarde..."}
        {error? "Ops parece que um error ocorreu" : ""}
                
                <textarea className="text-left p-2  h-100 w-9/10 "
                content={data?.generatedCode}
                >
                {data?.generatedCode}
                </textarea> 
            
            </div>
        </div>
        </>
    )
}
export default CodeCard