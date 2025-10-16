/**
 * Esta classe simula um stream do Node.js para a Web Serial API,
 * permitindo que bibliotecas como 'stk500-esm' a utilizem como camada de transporte.
 * Ela implementa os métodos essenciais (`write`, `on`, `destroy`, etc.)
 * para comunicação e gerenciamento do ciclo de vida da porta serial.
 */
import type { SerialPort } from './types';

export class WebSerialStream {
  private port: SerialPort;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private listeners: { [key: string]: ((...args: any[]) => void)[] } = {};
  private isReading = false;

  constructor(port: SerialPort) {
    this.port = port;
    this.writer = this.port.writable!.getWriter();
  }

  write(chunk: Uint8Array, callback?: (error?: Error) => void): void {
    this.writer!.write(chunk).then(
      () => { if (callback) callback(); },
      (error) => { if (callback) callback(error); }
    );
  }

  on(event: string, listener: (...args: any[]) => void): this {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);

    if (event === 'data' && !this.isReading) {
      this.isReading = true;
      this.startReadingLoop();
    }
    return this;
  }

  removeListener(event: string, listener: (...args: any[]) => void): this {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    }
    return this;
  }

  destroy = (): void => {
    const cleanup = async () => {
      if (this.reader) {
        try {
          await this.reader.cancel();
          this.reader.releaseLock();
        } catch (error) {
          // Ignore errors on cancel
        }
        this.reader = null;
      }
      if (this.writer) {
        try {
          await this.writer.abort();
          this.writer.releaseLock();
        } catch (error) {
          
        }
        this.writer = null;
      }
      if (this.port.readable) {
        try {
          await this.port.close();
        } catch (error) {
        
        }
      }
      this.emit('close');
    };
    cleanup();
  }

  private emit(event: string, ...args: any[]): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in '${event}' listener:`, error);
        }
      });
    }
  }

  private async startReadingLoop(): Promise<void> {
    if (!this.port.readable) return;
    this.reader = this.port.readable.getReader();
    try {
      while (true) {
        const { value, done } = await this.reader.read();
        if (done) {
          break;
        }
        this.emit('data', value);
      }
    } catch (error) {
      this.emit('error', error);
    } finally {
      this.isReading = false;
    }
  }
}
