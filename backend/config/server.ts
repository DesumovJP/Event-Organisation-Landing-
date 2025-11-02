export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ['appKey1', 'appKey2', 'appKey3', 'appKey4']),
  },
});
