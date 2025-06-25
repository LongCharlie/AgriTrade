// auth.js
export let currentUser = null;

export function loadUserFromStorage() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
    }
}

export function saveUserToStorage() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

export function clearUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
}

export async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (currentUser && currentUser.token) {
        options.headers['Authorization'] = `Bearer ${currentUser.token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '请求失败');
        }

        return await response.json();
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    }
}

export function checkAuth() {
    loadUserFromStorage();
    return currentUser !== null;
}

export function checkRole(allowedRoles) {
    loadUserFromStorage();
    return currentUser && allowedRoles.includes(currentUser.role);
}