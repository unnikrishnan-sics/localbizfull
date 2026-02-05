const axios = require('axios');

const BASE_URL = 'http://localhost:4056';

const endpoints = [
    { method: 'GET', path: '/', expectedStatus: 200 },
    { method: 'POST', path: '/customer/login', expectedStatus: 404 }, // Should be 404 if user doesn't exist, but proves endpoint exists
    { method: 'POST', path: '/bussiness/login', expectedStatus: 404 },
    { method: 'POST', path: '/organisation/login', expectedStatus: 404 },
    { method: 'POST', path: '/admin/login', expectedStatus: 400 }, // Admin login returns 400 for empty body
];

async function verifyRoutes() {
    console.log('--- API Health Check ---');
    for (const endpoint of endpoints) {
        try {
            const url = `${BASE_URL}${endpoint.path}`;
            let response;
            if (endpoint.method === 'GET') {
                response = await axios.get(url);
            } else {
                response = await axios.post(url, {}).catch(err => err.response);
            }

            const status = response ? response.status : 'No Response';
            const statusIcon = status === endpoint.expectedStatus ? '✅' : '❓';
            console.log(`${statusIcon} ${endpoint.method} ${endpoint.path} -> Status: ${status} (Exp: ${endpoint.expectedStatus})`);
        } catch (error) {
            console.log(`❌ ${endpoint.method} ${endpoint.path} -> Error: ${error.message}`);
        }
    }
}

verifyRoutes();
