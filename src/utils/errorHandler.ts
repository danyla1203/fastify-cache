import gRPC from '@grpc/grpc-js';
import { ApplicationError } from '../ApplicationError.js';

export const errorHandler = (err, _, reply) => {
  if (err.code === gRPC.status.NOT_FOUND) {
    reply.code(404).send({ code: 404, message: err.details } as never);
  } else if (err instanceof ApplicationError) {
    reply
      .code(err.code)
      .send({ code: err.code, message: err.message } as never);
  } else {
    console.log(err);
    reply.code(500).send({ message: 'Something went wrong' });
  }
};
