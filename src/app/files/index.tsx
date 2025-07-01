export const getDataUtility = (fileName: string) => {
  let files: object[];
  
  switch (process.env.NODE_ENV) {
    case 'development':
      files = require(`./${fileName}_dev.json`);
      break;
    case 'production':
      files = require(`./${fileName}.json`);
      break;
    default:
      throw new Error('Unknown environment');
  }

  return files;
};
