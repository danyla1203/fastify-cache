import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import protoLoader from '@grpc/proto-loader';
import gRPC from '@grpc/grpc-js';
import { InsertResourceDto } from '../resource.controller.js';

async function gRpcPlugin(scope: FastifyInstance) {
  const packageDef = await protoLoader.load(
    'src/resource/src/resource.proto',
    {},
  );
  const gRPCObjects = gRPC.loadPackageDefinition(packageDef);
  const packages = gRPCObjects.resource as any;

  const client = new packages.Resource(
    '0.0.0.0:4000',
    gRPC.credentials.createInsecure(),
  );
  const methods = [
    'getById',
    'insertResource',
    'getAllResource',
    'updateResource',
    'deleteResource',
  ];
  for (const method of methods) {
    const prevMethod = client[method].bind(client);
    client[method] = (data: any) =>
      new Promise((res, rej) => {
        prevMethod(data, (err, resp) => {
          if (err) rej(err);
          res(resp);
        });
      });
  }

  scope.decorate('rpc', client);
}

export default fp(gRpcPlugin);
