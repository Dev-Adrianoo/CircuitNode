import { basename, join } from "path";
import { promises as fs } from "fs";
import createTempDirectory from "../compiler-utils/create_tempdir ";
import createTempFile from "../compiler-utils/create_tempfile";
import { cleanupDir } from "../compiler-utils/tempdir_cleanup";

export const handleCliExecution = async (code: string, board: string, action: (tempDir: string) => Promise<any>) => {
  let tempDir: string | undefined;

  try {
    tempDir = await createTempDirectory();
    const tempFileName = basename(tempDir);
    await createTempFile(
      tempDir,
      `${tempFileName}.ino`,
      code
    );

    const result = await action(tempDir);

    const hexFileName = `${tempFileName}.ino.hex`;
    const hexFilePath = join(tempDir, 'build', `arduino.avr.${board}`, hexFileName);
    
    const hexContent = await fs.readFile(hexFilePath, 'utf-8');

    return { ...result, hex: hexContent };

  } catch(error) {
    console.error("Error during CLI execution or file handling:", error);
    // Re-throw the error to be caught by the controller
    throw error;
  } finally {
    if (tempDir) {
      await cleanupDir(tempDir).catch(err => console.error("Failed to cleanup temp directory:", err));
    }
  }
}