export const getUserStats = async () => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${baseURL}/api/user-stats`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error');
    }

    const data = await response.json();
    return data;
};