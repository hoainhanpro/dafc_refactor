// PM2 Ecosystem Configuration for Azure App Service
// Manages reverse proxy, Next.js Web, and NestJS API

module.exports = {
    apps: [
        // Reverse Proxy - listens on Azure's PORT (8080)
        {
            name: 'proxy',
            cwd: '/home/site/wwwroot',
            script: 'proxy.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 8080
            },
            error_file: '/home/LogFiles/proxy-error.log',
            out_file: '/home/LogFiles/proxy-out.log',
            time: true,
            wait_ready: true,
            listen_timeout: 10000
        },
        // NestJS API - internal port 3001
        {
            name: 'api',
            cwd: '/home/site/wwwroot/api',
            script: 'dist/main.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 3001
            },
            error_file: '/home/LogFiles/api-error.log',
            out_file: '/home/LogFiles/api-out.log',
            time: true
        },
        // Next.js Web - internal port 3000
        {
            name: 'web',
            cwd: '/home/site/wwwroot/web',
            script: 'server.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
                HOSTNAME: '0.0.0.0'
            },
            error_file: '/home/LogFiles/web-error.log',
            out_file: '/home/LogFiles/web-out.log',
            time: true
        }
    ]
};
