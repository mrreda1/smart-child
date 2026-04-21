const { deleteFile } = require('../utils/files');

const cleanupReqFile = async (err, req, res, next) => {
  try {
    if (req.file && req.file.path) {
      await deleteFile(req.file.path);
    }
  } catch (err) {
    console.error('Failed to clean up orphaned files:', err.message);
  }

  next(err);
};

module.exports = { cleanupReqFile };
