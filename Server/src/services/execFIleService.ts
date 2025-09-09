import { exec } from "node:child_process";

export default function ArduinoCLIVerification(command:string){
    
    exec(command, (err, stdout, stderr)=> {
        if(err){

           console.error("Error occurred when executing " +  err)
        }
        if(stderr){
            console.error("Command" + stderr +"failed")
        }
    })

 
}