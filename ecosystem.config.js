// PM2 Ecosystem Configuration for Azure App Service
// Manages both NestJS API and Next.js Web in single App Service

module.exports = {
    apps: [
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
