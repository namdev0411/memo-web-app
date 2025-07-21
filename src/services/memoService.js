import axios from '../utils/axios';

/**
 * Memo API Service
 * Handles all API requests related to memos
 */

// Helper to format date using Intl.DateTimeFormat (chuẩn locale, 24h, có seconds)
export function formatDate(date, withTime = false) {
    if (!date) return '';
    const d = new Date(date);
    if (withTime) {
        const dateStr = new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(d).replace(/\./g, '/');
        const timeStr = d.toLocaleTimeString('ja-JP', { hour12: false });
        return `${dateStr} ${timeStr}`;
    }
    return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(d).replace(/\./g, '/');
}

// Helper: convert ISO string to value for input type="datetime-local"
export function toDatetimeLocalValue(date) {
    if (!date) return '';
    // Sử dụng toISOString() và cắt chuỗi đúng chuẩn input type="datetime-local"
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
}

// Get all memos
export const getAllMemos = async () => {
    try {
        const response = await axios.get('/api/memo');
        if (response.data && response.data.data) {
            response.data.data = response.data.data.map(memo => {
                // Chỉ format để hiển thị, giữ nguyên actionDateTime là ISO string
                if (memo.actionDateTime) {
                    memo.actionDateTimeFormatted = formatDate(memo.actionDateTime, true);
                }
                if (memo.lastModifiedDate) {
                    memo.lastModifiedDate = formatDate(memo.lastModifiedDate);
                }
                return memo;
            });
        }
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
        if (response.data && response.data.data && response.data.data.actionDateTime) {
            response.data.data.actionDateTimeFormatted = formatDate(response.data.data.actionDateTime, true);
        }
        if (response.data && response.data.data && response.data.data.lastModifiedDate) {
            response.data.data.lastModifiedDate = formatDate(response.data.data.lastModifiedDate);
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching memo:', error);
        throw error;
    }
};

// Create new memo
export const createMemo = async (memoData) => {
    try {
        const response = await axios.post('/api/memo', {
            ...memoData,
            actionDateTime: memoData.actionDateTime,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating memo:', error);
        throw error;
    }
};

// Update memo
export const updateMemo = async (id, memoData) => {
    console.log('Updating memo with ID:', id, 'and data:', memoData);

    try {
        const response = await axios.patch(`/api/memo/update/${id}`, {
            ...memoData
        });
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
