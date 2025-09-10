
import { mkdtemp, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import generateArduinoCode from "./codeGeneratorService";
import createTempDirectory from "./createTempDirService ";
import createTempFile from "./createTempFile";


export default async function FileWritter(content:string){

    let tempDir:string | undefined;      
   
    try{
        tempDir = await createTempDirectory();
        const tempContent = await createTempFile(tempDir, "tmp.ino", content); 
        
        
     }catch(error){
         console.error(error);
     }
     finally{
        if(tempDir){
            await rm(tempDir, {recursive:true , force: true});
            console.log("Directory"+ tempDir + "delete");
        }
     }
}