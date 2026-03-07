// src/hooks/useStats.ts

"use client"
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../lib/axiosClient';

const fetchStats = async () => {
  
  const { data } = await axiosClient.get('/api/stats');
  return data;
};

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });
};