import { mkdtemp, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { basename, join } from "path";
import generateArduinoCode from "./codeGeneratorService";
import createTempDirectory from "./createTempDirService ";
import createTempFile from "./createTempFile";
import ArduinoCLIVerification from "./execFIleService";

export default async function FileWritter(
  content: string,
  board: string
): Promise<void> {
  let tempDir: string | undefined;

  try {
    tempDir = await createTempDirectory();
    let fileName = basename(tempDir);
    const tempContent = await createTempFile(tempDir, fileName, content);
    const cliresponse = await ArduinoCLIVerification("arduino-cli", board, tempDir)
      .then(result => console.error("Arduino-CLI Response", result.stdout))
      .catch(error => console.error("Arduino-CLI Error", error));
    return cliresponse   
  } catch (error) {
    console.error(error);
    throw error
     
  } finally {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
      console.log("Directory" + tempDir + "delete");
    }
    
  }
}
