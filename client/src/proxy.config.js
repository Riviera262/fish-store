const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  // Định nghĩa các route cụ thể trước
  app.use(
    '/cart',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  )
  app.use(
    '/products',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  )
  app.use(
    '/users',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  )
  app.use(
    '/categories',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  )
  // Sau đó, middleware tổng quát cho các request khác
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  )
}
