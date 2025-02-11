import { getProjectTodos } from '$lib/wip';

export async function load() {
    try {
        const todos = await getProjectTodos('personalwebsites');
        return { todos };
    } catch (error) {
        console.error('Failed to load todos:', error);
        return {
            todos: null,
            error: 'Failed to load todos'
        };
    }
}