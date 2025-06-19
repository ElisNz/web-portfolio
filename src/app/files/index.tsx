export const getDataUtility = (fileName: string) => {
  switch (process.env.NODE_ENV) {
    case 'development':
      const files = require(`./${fileName}_dev.json`);
      return files;
    case 'production':
      return import(`./${fileName}.json`);
    default:
      throw new Error('Unknown environment');
  }
};
