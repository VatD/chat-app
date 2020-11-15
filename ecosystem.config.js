module.exports = {
    apps: [
        {
            name: "chat app",
            script: "./server/server.js",
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
    ],
};
