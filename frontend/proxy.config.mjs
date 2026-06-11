const target = process.env.BACKEND_URL ?? 'http://localhost:8080';

export default {
  '/api': {
    target,
    secure: false,
    changeOrigin: true,
  },
};
