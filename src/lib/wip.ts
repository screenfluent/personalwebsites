const API_KEY = 'wip_sk_7582ec30ae86f20655e67506';
const API_URL = 'https://api.wip.co/v1';

export async function getProjectTodos(projectId: string, limit = 5) {
    const response = await fetch(
        `${API_URL}/projects/${projectId}/todos?limit=${limit}&api_key=${API_KEY}`
    );
    
    if (!response.ok) {
        throw new Error('Failed to fetch todos');
    }

    const data = await response.json();
    return data;
}