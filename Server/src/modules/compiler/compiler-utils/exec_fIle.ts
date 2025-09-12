import { exec, execFile } from "node:child_process";
import { promisify } from "node:util";

const execFilePromise = promisify(execFile);

export default async function ArduinoCLIVerification(
  command: string,
  board: string,
  tempDirPath: string
): Promise<{ stdout: string; stderr: string }> {
  const args = [
    'compile',
    '--fqbn',
    `arduino:avr:${board}`,
    tempDirPath
  ]
  try {
    const { stdout, stderr } = await execFilePromise(command, args);
    
    return { stdout, stderr };
  } catch (error) {
    console.log("Error When running the code" + error);
    throw error;
  }
}

