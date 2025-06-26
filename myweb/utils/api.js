
export const apiRequest = async (url, method = 'GET', data = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data); // 如果有数据，序列化
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '请求失败');
        }

        return await response.json(); // 返回 JSON 格式的响应
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    }
};
