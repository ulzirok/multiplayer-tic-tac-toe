export const createSession = async (username) => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${baseURL}/api/create-session`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error');
    }

    const data = await response.json();
    return data;
};
