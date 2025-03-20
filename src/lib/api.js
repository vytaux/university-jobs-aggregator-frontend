const API_BASE_URL = 'http://localhost:8080';

export async function fetchJobs(page = 1, pageSize = 100) {
    const response = await fetch(`${API_BASE_URL}?page=${page}&page_size=${pageSize}`);
    if (!response.ok) {
        throw new Error('Failed to fetch jobs');
    }
    return response.json();
}