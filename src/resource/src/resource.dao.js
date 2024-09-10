import { client } from './utils/db.js';

const getItemById = async (id) => {
  try {
    return await client('resource').where('id', id).first();
  } catch (e) {
    console.log(e);
  }
};

const insertItem = async (input) => {
  try {
    return (await client('resource').insert(input, '*'))[0];
  } catch (e) {
    console.log(e);
  }
};

const getAllResources = async () => {
  try {
    return await client('resource').select();
  } catch (e) {
    console.log(e);
  }
};

const updateItem = async (id, input) => {
  try {
    const item = await client('resource').where('id', id).first();
    if (!item) return null;
    return (await client('resource').where('id', id).update({
      name: input.name || item.name,
      price: input.price || item.price,
      description: input.description || item.description,
      text: input.text || item.text
    }, '*'))[0];
  } catch (e) {
    console.log(e);
  }
};

const deleteItem = async (id) => {
  try {
    return (await client('resource').where('id', id).del('*'))[0];
  } catch (e) {
    console.log(e);
  }
};

export default {
  getItemById,
  insertItem,
  getAllResources,
  updateItem,
  deleteItem,
};
