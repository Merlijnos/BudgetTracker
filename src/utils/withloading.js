// src/utils/withLoading.js
import { useLoading } from '../contexts/LoadingContext';

export const withLoading = async (asyncFunc) => {
  const { startLoading, stopLoading } = useLoading();
  
  try {
    startLoading();
    const result = await asyncFunc();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    stopLoading();
  }
};