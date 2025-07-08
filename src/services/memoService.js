import axios from '../utils/axios';

/**
 * Memo API Service
 * Handles all API requests related to memos
 */

// Get all memos
export const getAllMemos = async () => {
    try {
        const response = await axios.get('/api/memo');
        return response.data;
    } catch (error) {
        console.error('Error fetching memos:', error);
        throw error;
    }
};

// Get memo by ID
export const getMemoById = async (id) => {
    try {
        const response = await axios.get(`/api/memo/update/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching memo:', error);
        throw error;
    }
};

// Create new memo
export const createMemo = async (memoData) => {
    try {
        const response = await axios.post('/api/memo', memoData);
        return response.data;
    } catch (error) {
        console.error('Error creating memo:', error);
        throw error;
    }
};

// Update memo
export const updateMemo = async (id, memoData) => {
    try {
        const response = await axios.patch(`/api/memo/update/${id}`, memoData);
        return response.data;
    } catch (error) {
        console.error('Error updating memo:', error);
        throw error;
    }
};

// Delete memo
export const deleteMemo = async (id) => {
    try {
        const response = await axios.delete(`/api/memo/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting memo:', error);
        throw error;
    }
};

// Test connection (same as getAllMemos but with different error handling)
export const testConnection = async () => {
    try {
        const response = await axios.get('/api/memo');
        return response.data;
    } catch (error) {
        console.error('Error testing connection:', error);
        throw error;
    }
};
