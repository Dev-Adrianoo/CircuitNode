import { writeFile } from "fs/promises";
import { join } from "path";

export default async function createTempFile(tempDir:string ,fileName:string ,content:string ){
    
    const filePath = join(tempDir,fileName);
    await writeFile(filePath, content);
    console.log("File created sucessfully");
    return filePath;
}
