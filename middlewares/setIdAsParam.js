const setIdAsParam = (key) => {
  return (req, res, next) => {
    req.params.id = req[key].id;
    next();
  };
};

module.exports = setIdAsParam;
