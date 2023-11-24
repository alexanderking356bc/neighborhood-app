import { redirect } from 'react-router';
import axios from 'axios';
import { CreateNeighborhoodData, Neighborhood } from '@neighborhood/backend/src/types';
import { EditNeighborhoodData, NeighborhoodType } from '../types';
import { getStoredUser } from '../utils/auth';

const BASE_URL = '/api/neighborhoods';

async function getAllNeighborhoods(): Promise<Neighborhood[]> {
  const response = await axios.get(BASE_URL);
  return response.data;
}

// TODO: If unable to login because of token invalid or otherwise
// throw Error
async function getSingleNeighborhood(
  id: number,
): Promise<NeighborhoodType | null> {
  const userDataInLocalStorage = getStoredUser();

  if (userDataInLocalStorage) {
    const headers = { authorization: `Bearer ${userDataInLocalStorage.token}` };
    const response = await axios.get(`${BASE_URL}/${id}`, { headers });
    
    return response.data;
  }

  return null;
}

async function createNeighborhood(
  neighborhoodData: CreateNeighborhoodData,
): Promise<Response | { success: string } | { error: string }> {
  const user = getStoredUser();
  if (!user) return redirect('/login');

  const headers = { authorization: `Bearer ${user.token}` };
  const response = await axios.post(`${BASE_URL}`, neighborhoodData, { headers });

  return response.data;
}

async function connectUserToNeighborhood(
  neighborhoodId: number,
): Promise<Response | { success: string } | { error: string }> {
  const user = getStoredUser();
  if (!user) return redirect('/login');

  const headers = { authorization: `Bearer ${user.token}` };
  const response = await axios.post(`${BASE_URL}/${neighborhoodId}/join`, null, { headers });

  return response.data;
}

async function leaveNeighborhood(
  neighborhoodId: number,
): Promise<Response | { success: string } | { error: string }> {
  const user = getStoredUser();
  if (!user) return redirect('/login');

  const headers = { authorization: `Bearer ${user.token}` };
  await axios.put(`${BASE_URL}/${neighborhoodId}/leave`, null, { headers });

  return redirect('/');
}

async function editNeighborhood(
  neighborhoodId: number,
  neighborhoodData: EditNeighborhoodData,
): Promise<Response | { success: string } | { error: string }> {
  const user = getStoredUser();
  if (!user) return redirect('/login');

  const headers = { authorization: `Bearer ${user.token}` };
  const response = await axios.put(`${BASE_URL}/${neighborhoodId}`, neighborhoodData, { headers });

  return response.data;
}

export default {
  getAllNeighborhoods,
  getSingleNeighborhood,
  connectUserToNeighborhood,
  leaveNeighborhood,
  editNeighborhood,
  createNeighborhood
};
