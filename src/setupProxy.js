const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        '/ws',
        createProxyMiddleware( ['!/sockjs-node'], {
            target: "ws://localhost:8080/",
            ws: true,
            changeOrigin: true,
            logLevel: 'warn'
        })
    );
};