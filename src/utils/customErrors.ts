export class AppError extends Error {
  public status;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class ClientError extends AppError {
  public field: string;

  constructor(message: string, field: string, status: number = 400) {
    super(message, status);
    this.field = field;
  }
}
