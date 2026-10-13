export default ({ env }) => ({
  host: '127.0.0.1',
  port: 1340,
  app: { keys: env.array('APP_KEYS') },
});
