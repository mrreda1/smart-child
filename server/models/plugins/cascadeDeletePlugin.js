const mongoose = require('mongoose');

module.exports = function cascadeDeletePlugin(schema, options) {
  const { modelName, foreignKey } = options;

  schema.pre(
    ['deleteOne', 'findOneAndDelete'],
    { document: true, query: true },
    async function (next) {
      const TargetModel = mongoose.model(modelName);

      if (this instanceof mongoose.Document) {
        await TargetModel.deleteMany({ [foreignKey]: this._id });
      } else {
        const filter = this.getQuery();
        const docToDelete = await this.model.findOne(filter);
        if (docToDelete) {
          await TargetModel.deleteMany({ [foreignKey]: docToDelete._id });
        }
      }
      next();
    },
  );
};
