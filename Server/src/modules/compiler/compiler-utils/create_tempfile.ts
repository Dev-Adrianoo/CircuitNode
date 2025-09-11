import { mkdir } from "fs/promises";
import { writeFile } from "fs/promises";
import { join } from "path";

export default async function createTempFile(
  tempDir: string,
  fileName: string,
  content: string
): Promise<string> {
  try {
    await mkdir(tempDir, { recursive: true });
    const filePath = join(tempDir, fileName);
    await writeFile(filePath, content);
    console.log("File created sucessfully");
    return filePath;
  } catch (error) {
    console.error("Error when creating temp File:" + error);
    throw error;
  }
}
