// 存储token和用户信息
let currentUser = null;

// 从本地存储加载用户信息
function loadUserFromStorage() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
    }
}

// 保存用户信息到本地存储
function saveUserToStorage() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// 清除用户信息
function clearUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
}

// 通用API请求函数
async function apiRequest(url, method = 'GET', data = null) {
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

// 检查登录状态并跳转
function checkAuth() {
    loadUserFromStorage();
    return currentUser !== null;
}

// 检查角色权限
function checkRole(allowedRoles) {
    loadUserFromStorage();
    return currentUser && allowedRoles.includes(currentUser.role);
}

// 初始化页面时检查登录状态
document.addEventListener('DOMContentLoaded', function() {
    loadUserFromStorage();
    
    // 显示/隐藏登录相关元素
    const authElements = document.querySelectorAll('[data-auth]');
    const unauthElements = document.querySelectorAll('[data-unauth]');
    
    if (checkAuth()) {
        authElements.forEach(el => el.style.display = 'block');
        unauthElements.forEach(el => el.style.display = 'none');
        
        // 显示用户信息
        const userInfoElements = document.querySelectorAll('[data-user]');
        userInfoElements.forEach(el => {
            const prop = el.getAttribute('data-user');
            el.textContent = currentUser[prop] || '';
        });
    } else {
        authElements.forEach(el => el.style.display = 'none');
        unauthElements.forEach(el => el.style.display = 'block');
    }
});