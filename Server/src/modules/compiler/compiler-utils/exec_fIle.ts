import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFilePromise = promisify(execFile);

export const executeCommand = async (command: string, args: string[]): Promise<{ stdout: string; stderr: string }> => {

  try {
    const { stdout, stderr } = await execFilePromise(command, args);
    return { stdout, stderr };

  } catch (error) {
    console.error(`Error executing command: ${command} ${args.join(' ')}`, error);
    throw error;
    
  }
};