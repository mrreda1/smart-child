const path = require('path');
const { deleteFile } = require('../utils/files');

const cleanupOldFile = (objectName, propertyName) => {
  objectName = objectName.charAt(0).toUpperCase() + objectName.slice(1);
  objectName = `old${objectName}`;

  return async (req, res, next) => {
    if (!req[objectName]) return next();

    const oldFilePath = path.resolve(
      __dirname,
      '../uploads/profiles',
      req[objectName][propertyName],
    );

    if (req.method === 'PATCH' && !req.body[propertyName]) return next();

    await deleteFile(oldFilePath);

    next();
  };
};

module.exports = { cleanupOldFile };
