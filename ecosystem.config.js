module.exports = {
    apps: [
        {
            name: "chat app",
            script: "./server/server.js",
            instances: "max",
            exec_mode: "cluster",
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
    ],
};
