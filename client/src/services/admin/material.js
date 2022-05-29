import axios from "axios";

export const addMaterial = (data) => axios.put("/adminapi/material/add", data);

export const deleteMaterial = (data) =>
  axios.put("/adminapi/material/delete", data);

export const updateMaterialOrder = (data) =>
  axios.put("/adminapi/material/update/order", data);
