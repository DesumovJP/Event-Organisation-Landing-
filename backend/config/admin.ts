export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'dev-admin-jwt-secret'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'dev-api-token-salt'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'dev-transfer-token-salt'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY', 'dev-encryption-key-32-bytes-long!'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
