import path from 'path';

// The test environment cannot accept a remote database URL.
export default () => ({
  connection: {
    client: 'sqlite',
    connection: { filename: path.resolve(process.cwd(), '.tmp/seo-test/data.db') },
    useNullAsDefault: true,
  },
});
