

import { deleteGPSData, getAllGPSData, insertGPSData, updateGPSData } from '../models/gpsDao';
import { GPSData } from '../types/GPSData';

export const saveGPSData = async (data: GPSData) => {
  await insertGPSData(data);
};

export const fetchGPSData = async () => {
  return await getAllGPSData();
};

export const modifyGPSData = async (id: number, data: Partial<GPSData>) => {
  await updateGPSData(id, data);
};

export const removeGPSData = async (id: number) => {
  await deleteGPSData(id);
};
