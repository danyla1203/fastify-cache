import dao from './resource.dao.js';
import gRPC from '@grpc/grpc-js';

const getById = async (call, cb) => {
  const id = call.request.id;
  const item = await dao.getItemById(id);

  if (!item) {
    cb({
      code: gRPC.status.NOT_FOUND,
      details: `Could not find resource with the specified id: ${id}`
    });
  } else {
    item.createdAt = item.createdAt + '';
    console.log(item);
    cb(null, item);
  }

};

const insertResource = async (call, cb) => {
  const result = await dao.insertItem(call.request);
  if (!result) cb({ code: gRPC.status.UNAVAILABLE });
  else cb(null, result);
};

const getAllResource = async (call, cb) => {
  const items = await dao.getAllResources();
  cb(null, { items });
};

const updateResource = async (call, cb) => {
  const updatedOne = await dao.updateItem(call.request.id, call.request);
  console.log(updatedOne);
  if (!updatedOne) cb({
    code: gRPC.status.NOT_FOUND,
    details: 'Could not find resource with the specified id'
  });
  cb(null, updatedOne);
};
const deleteResource = async (call, cb) => {
  const item = await dao.deleteItem(call.request.id);
  if (!item) {
    cb({
      code: gRPC.status.NOT_FOUND,
      details: 'Could not find resource with the specified id'
    });
  } else {
    cb(null, { deleted: true, message: 'Deleted' });
  }
};

export default {
  getById,
  insertResource,
  getAllResource,
  updateResource,
  deleteResource,
};
