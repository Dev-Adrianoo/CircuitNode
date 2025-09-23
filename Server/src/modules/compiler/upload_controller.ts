import { type Request, type Response } from "express";
import createTempDirectory from "./compiler-utils/create_tempdir ";
import { basename } from "path";
import createTempFile from "./compiler-utils/create_tempfile";
import { cleanupDir } from "./compiler-utils/tempdir_cleanup";
import { ArduinoCLIUploader } from "./compiler-utils/exec_upload";
import { handleCliExecution } from "./compiler-services/execution_helper";

interface UploadRequestData {
  code: string;
  board: string;
  port: string;
}

export const uploadController = async (req: Request, res: Response) => {
  
  try {
    
    const { code, board, port} = req.body;

    const uploadJob = (tempDir: string) => {
      return ArduinoCLIUploader(board, port, tempDir);
    }

    const uploadResult = await handleCliExecution(code, uploadJob);

    return res.status(200).json({ success: true, data: uploadResult  })

  }catch (error) {
    console.error(`error in upload controller, ${error}`)
    return res.status(500).json({ success: false, error: "Server error" })
  }
}