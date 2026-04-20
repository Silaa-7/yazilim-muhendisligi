const BASE_URL = "http://localhost:8080";

// SENSOR
export const getSensors = async () => {
  const res = await fetch(`${BASE_URL}/sensors`);
  return res.json();
};

// GREENHOUSE
export const getGreenhouses = async () => {
  const res = await fetch(`${BASE_URL}/greenhouses`);
  return res.json();
};

// CROP PLAN
export const getCropPlans = async () => {
  const res = await fetch(`${BASE_URL}/crop-plans`);
  return res.json();
};