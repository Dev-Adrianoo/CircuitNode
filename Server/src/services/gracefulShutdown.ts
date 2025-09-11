import { rm } from "fs/promises"
import path from "path"

const gracefulShutDown = async() =>{
    console.log("Signal received, Deleting temp files...")
    await rm(path.join(process.cwd(), "tmp"), {recursive:true, force:true})
    process.exit(0)

}
export default gracefulShutDown;

