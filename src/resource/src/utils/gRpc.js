import gRPC from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

export async function gRpcObjects(protoPath) {
  const packageDef = await protoLoader.load(protoPath, {});
  const gRPCObject = gRPC.loadPackageDefinition(packageDef);
  return gRPCObject.resource;
}

export function gRpcServer(services, serverCb) {
  const server = new gRPC.Server();
  for (const service of services) {
    server.addService(service.rpcInterface, service.handlers);
  }
  const creds = gRPC.ServerCredentials.createInsecure();
  server.bindAsync('0.0.0.0:4000', creds, serverCb);
}