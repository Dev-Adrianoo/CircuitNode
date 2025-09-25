import { executeCommand } from './exec_fIle'; 

export const ArduinoCLIVerification = async (board: string, tempDirPath: string) => {
  const args = [
    'compile',
    '--fqbn',
    `arduino:avr:${board}`,
    '--export-binaries',
    tempDirPath
  ];

  return await executeCommand('arduino-cli', args);
};