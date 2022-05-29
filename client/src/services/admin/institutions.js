import axios from "axios";

export const fetchInstitutions = () => axios.get("/adminapi/institutions/all");

export const fetchOneInstitution = (schoolId) =>
  axios.get(`/adminapi/institutions/${schoolId}`);

export const newInstitution = (data) =>
  axios.post("/adminapi/institutions/new", data);

export const updateInstitutionName = (data) =>
  axios.put("/adminapi/institutions/update/name", data);

export const updateInstitutionDescription = (data) =>
  axios.put("/adminapi/institutions/update/description", data);

export const deleteInstitution = (data) =>
  axios.put("/adminapi/institutions/delete", data);
