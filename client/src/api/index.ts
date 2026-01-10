import axios from 'axios';
import type { Student } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an Axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const getResults = async (): Promise<Student[]> => {
    const response = await api.get('/results');
    return response.data;
};

export const getStudent = async (id: string): Promise<Student> => {
    const response = await api.get(`/results/${id}`);
    return response.data;
};

export const deleteStudent = async (id: string) => {
    await api.delete(`/results/${id}`);
};

export const deleteAllStudents = async () => {
    await api.delete('/results');
};

export const login = async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const getExamConfig = async () => {
    const response = await api.get('/config');
    return response.data;
};

export const saveExamConfig = async (config: any) => {
    const response = await api.post('/config', config);
    return response.data;
};
