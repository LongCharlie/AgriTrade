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

    // 处理不同类型的数据
    if (data instanceof FormData) {
        // 如果是FormData，不设置Content-Type，浏览器会自动设置
        options.body = data;
    } else if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '请求失败');
        }

        // 如果响应没有内容，返回null
        if (response.status === 204) {
            return null;
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
    if (!currentUser) return false;
    // 管理员拥有所有权限
    if (currentUser.role === 'admin') return true;
    return currentUser && allowedRoles.includes(currentUser.role);
}

// 获取用户头像
async function getUserAvatar() {
    try {
        const response = await apiRequest('/api/user/avatar');
        if (response && response.avatarUrl) {
            return response.avatarUrl;
        }
        return '/images/default-avatar.png'; // 默认头像路径
    } catch (error) {
        console.error('获取头像失败:', error);
        return '/images/default-avatar.png';
    }
}

async function uploadAvatar(file) {
    try {
        const formData = new FormData();
        formData.append('avatar', file);
        
        // 注意这里使用 /api/user/avatar 而不是 /api/upload
        const response = await fetch('/api/user/avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '上传失败');
        }
        
        const result = await response.json();
        if (result && result.avatarUrl) {
            // 更新当前用户的头像URL
            if (currentUser) {
                currentUser.avatarUrl = result.avatarUrl;
                saveUserToStorage();
            }
            return result.avatarUrl;
        }
        throw new Error('上传失败');
    } catch (error) {
        console.error('上传头像失败:', error);
        throw error;
    }
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

