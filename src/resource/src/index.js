import { initKafka } from './utils/kafka.js';
import resource from './resource.service.js'
import { gRpcObjects, gRpcServer } from './utils/gRpc.js';

async function main() {
  const { Resource } = await gRpcObjects('./src/resource.proto');
  gRpcServer([
    {
      rpcInterface: Resource.service,
      handlers: { ...resource }
    },
  ], () => { console.log('gRPC server start') });
  //await initKafka();
}

main();
