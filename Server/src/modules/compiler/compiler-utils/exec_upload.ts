import { executeCommand } from "./exec_fIle";

export const ArduinoCLIUploader = async (board: string, port: string, tempDirPath: string) => {
  const args = [
    'upload',
    '-b',
    board,
    '-p',
    port,
    tempDirPath
  ]

  return await executeCommand('arduino-cli', args)
}