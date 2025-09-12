import { rm } from "fs/promises";

export async function cleanuoDir(tempDirPath: string): Promise<void> {
  try {
    await rm(tempDirPath, { recursive: true, force: true });
    console.log("Directory" + tempDirPath + "delete");
  } catch (error) {
    console.log("Error when deleting file", error);
  }
}
