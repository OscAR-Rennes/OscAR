export interface AppErrorParams {
  userMessage: string; // safe message to show to end-user / front
  statusCode?: number; // http status code
  details?: any; // optional structured details for the frontend
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly userMessage: string;
  public readonly details?: any;
  public readonly route?: string;

  constructor({ userMessage, statusCode = 400, details, route}: AppErrorParams & { route?: string }) {
      super(userMessage);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.userMessage = userMessage;
    this.details = details;
    this.route = route;

    Error.captureStackTrace?.(this, this.constructor);
  }

  // Safe payload intended to be sent to the client/front
  public toClient() {
    return {
      message: this.userMessage,
      statusCode: this.statusCode,
      details: this.details ?? undefined,
    };
  }
}

export default AppError;
