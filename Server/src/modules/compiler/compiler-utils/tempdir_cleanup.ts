import { rm } from "fs/promises";

export async function cleanupDir(tempDirPath: string): Promise<void> {
  try {
    await rm(tempDirPath, { recursive: true, force: true });
    console.log("Directory" + tempDirPath + "delete");
  } catch (error) {
    console.log("Error when deleting file", error);
  }
}
