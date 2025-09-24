import { basename } from "path";
import createTempDirectory from "../compiler-utils/create_tempdir ";
import createTempFile from "../compiler-utils/create_tempfile";
import { cleanupDir } from "../compiler-utils/tempdir_cleanup";


export const handleCliExecution = async (code: string, action: (tempDir: string) => Promise<any> ) => {
  let tempDir: string | undefined;

  try {
    tempDir = await createTempDirectory();
    const tempFileName = basename(tempDir);
    await createTempFile(
      tempDir,
      `${tempFileName}`,
      code
    );

    const result = await action(tempDir);
    return result
  } finally {

    if(tempDir) {
      await cleanupDir(tempDir)
    }
  }
}