import { executeCommand } from "./exec_fIle";

export const ArduinoCLIUploader = async (board: string, port: string, tempDirPath: string) => {
  let tempFileName= tempDirPath.split("/").pop();

  console.log(tempFileName)
  const args = [
    'upload',
    '-b',
    `arduino:avr:${board}`,
    '-p',
    port,
    '--input-file',
    `${tempDirPath}/build/arduino.avr.${board}/${tempFileName}.ino.hex`
  ]

  return await executeCommand('arduino-cli', args)
}