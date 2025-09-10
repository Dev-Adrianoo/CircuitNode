import { mkdtemp } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

export default async function createTempDirectory() {

    const directoryPrefix = join(tmpdir(), "tmp_arduino");

    const tempDir = mkdtemp(directoryPrefix);

    console.log("Directory created sucessfully");
    return tempDir;

}