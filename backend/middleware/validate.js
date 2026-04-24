const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      msg: error.details[0].message.replace(/"/g, ""),
    });
  }
  req.body = value;
  next();
};

module.exports = validate;
