import { ApplicationError } from "./ApplicationError.js";

export class ResourceNotFound extends ApplicationError {
  constructor() {
    super(404, 'Resource not found');
  }
}