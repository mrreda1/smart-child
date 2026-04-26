const fs = require('fs/promises');
const path = require('path');

const PROFILES_DIR = path.resolve(__dirname, '../uploads/profiles');
const DEFAULT_PHOTO = 'default-user.jpg';

class FileService {
  profilePath(filename) {
    return path.join(PROFILES_DIR, filename);
  }

  async deleteProfilePhoto(filename) {
    if (!filename || filename === DEFAULT_PHOTO) return;

    try {
      await fs.unlink(this.profilePath(filename));
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }
}

module.exports = new FileService();
