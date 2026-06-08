const mongoose = require('mongoose');

const cascadeDeletePlugin = require('./plugins/cascadeDeletePlugin');
const { encryptText, decryptText } = require('../utils/cipher');

const chatSessionSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
      required: true,
    },
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.String,
      required: true,
      default: 'New Session',
    },
  },
  { timestamps: true },
);

chatSessionSchema.pre('save', function (next) {
  if (this.isModified('topic') && this.topic) {
    const key = process.env.ENCRYPTION_KEY;
    this.topic = encryptText(key, this.topic);
  }
  next();
});

const decryptSessionDocuments = function (docs, next) {
  if (!docs) return next();

  const key = process.env.ENCRYPTION_KEY;
  const documents = Array.isArray(docs) ? docs : [docs];

  documents.forEach((doc) => {
    if (doc.topic) {
      doc.topic = decryptText(key, doc.topic);
    }
  });

  next();
};

chatSessionSchema.post('find', decryptSessionDocuments);
chatSessionSchema.post('findOne', decryptSessionDocuments);

chatSessionSchema.plugin(cascadeDeletePlugin, [{ modelName: 'ChatMessage', foreignKey: 'sessionId' }]);

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

module.exports = ChatSession;
