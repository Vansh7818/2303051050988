/**
 * Notification API Consumer
 * 
 * Target: http://4.224.186.213/evaluation-service/notifications
 * Constraint: API is a protected Route
 */

const http = require('http');

/**
 * Fetches notifications from the evaluation service
 * @param {string} token - The authorization token (JWT or Bearer)
 * @returns {Promise<Object>} The API response
 */
function fetchNotifications(token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject(new Error("Authorization token is required for this protected route."));
        }

        const options = {
            hostname: '4.224.186.213',
            port: 80,
            path: '/evaluation-service/notifications',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                // Add any other required headers here
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsedData = JSON.parse(data);
                        resolve({
                            statusCode: res.statusCode,
                            data: parsedData
                        });
                    } catch (e) {
                        resolve({
                            statusCode: res.statusCode,
                            data: data // Return raw data if not JSON
                        });
                    }
                } else {
                    reject({
                        statusCode: res.statusCode,
                        message: `API returned status ${res.statusCode}`,
                        data: data
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject({
                message: "Failed to reach the API. Please check your network connection, VPN, or firewall settings.",
                error: error.message
            });
        });

        req.end();
    });
}

// Example usage
async function run() {
    // Replace with actual valid token provided for the assessment
    const TOKEN = process.env.API_TOKEN || "your_jwt_token_here";
    
    console.log("Fetching notifications from evaluation service...");
    try {
        const result = await fetchNotifications(TOKEN);
        console.log("Success! Status:", result.statusCode);
        console.log("Data:", JSON.stringify(result.data, null, 2));
    } catch (err) {
        console.error("Error fetching notifications:", err);
    }
}

if (require.main === module) {
    run();
}

module.exports = { fetchNotifications };
