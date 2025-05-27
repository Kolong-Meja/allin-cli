import { ILog } from "./interfaces/ILog.js";

export class Log implements ILog {
  public debug(message: string, ...data: any[]): void {
    this.emitMessage("debug", message, data);
  }

  public warn(message: string, ...data: any[]): void {
    this.emitMessage("warn", message, data);
  }

  public info(message: string, ...data: any[]): void {
    this.emitMessage("info", message, data);
  }

  public error(message: string, ...data: any[]): void {
    this.emitMessage("error", message, data);
  }

  private emitMessage(
    type: "debug" | "info" | "warn" | "error",
    message: string,
    details: any[]
  ): void {
    details.length > 0
      ? console[type](message, details)
      : console[type](message);
  }
}
