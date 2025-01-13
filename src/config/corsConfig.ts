const isProd = process.env.NODE_ENV === 'prod';

export default {
  origin: isProd
    ? process.env.CORS_ORIGIN || 'http://your-production-domain.com'
    : '*',
  methods: isProd
    ? process.env.CORS_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'DELETE']
    : ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: isProd
    ? process.env.CORS_HEADERS?.split(',') || ['Content-Type', 'Authorization']
    : ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  credentials: isProd ? process.env.CORS_CREDENTIALS === 'true' : true,
};
