const API_URL = 'https://api.wip.co/v1';

export async function getProjectTodos(projectId: string, limit = 5) {
    // API key should be provided via environment variable
    const API_KEY = process.env.WIP_API_KEY;
    
    if (!API_KEY) {
        throw new Error('WIP_API_KEY environment variable is not set');
    }

    const response = await fetch(
        `${API_URL}/projects/${projectId}/todos?limit=${limit}&api_key=${API_KEY}`
    );
    
    if (!response.ok) {
        throw new Error('Failed to fetch todos');
    }

    const data = await response.json();
    return data;
}