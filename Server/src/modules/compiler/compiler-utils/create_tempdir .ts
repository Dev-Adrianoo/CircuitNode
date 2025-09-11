import { mkdtemp } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

export default async function createTempDirectory(): Promise<string> {
  try {
    const directoryPrefix = join(tmpdir(), "tmp_arduino_");
    const tempDir = await mkdtemp(directoryPrefix);
    console.log("Directory created sucessfully");
    return tempDir;
  } catch (error) {
    console.error("Error when creating temp Dir" + error)
    throw error
  }
}
