import { promises as fs } from 'fs';
import { handleCliExecution } from './execution_helper';
import { ArduinoCLIVerification } from '../compiler-utils/exec_verification';
import { basename } from 'path';

/**
 * Compiles the given C++ code using arduino-cli and returns the compiled HEX file content.
 * @param code The C++ code to compile.
 * @param board The board type (e.g., 'uno').
 * @returns The content of the compiled .hex file as a string.
 */
export const compileAndGetHex = async (code: string, board: string): Promise<string> => {
  
  const compileAndReadHexAction = async (tempDir: string): Promise<string> => {
    // First, compile the code
    const compilationResult = await ArduinoCLIVerification(board, tempDir);
    console.log('Compilation stdout:', compilationResult.stdout);
    if (compilationResult.stderr) {
        console.error('Compilation stderr:', compilationResult.stderr);
        // Decide if stderr should always throw an error, or just be logged.
        // For now, we log it and proceed, as arduino-cli can print warnings to stderr.
    }

    // Determine the path to the compiled .hex file
    const sketchName = basename(tempDir);
    const hexFilePath = `${tempDir}/${sketchName}.ino.hex`;
    console.log(`Reading compiled hex file from: ${hexFilePath}`);

    // Read the hex file content
    const hexContent = await fs.readFile(hexFilePath, 'utf-8');
    return hexContent;
  };

  try {
    // Use the existing helper to handle temp directory and file creation
    const hexContent = await handleCliExecution(code, compileAndReadHexAction);
    return hexContent;
  } catch (error) {
    console.error("Error during compilation and hex retrieval:", error);
    throw new Error('Failed to compile and retrieve HEX file.');
  }
};
