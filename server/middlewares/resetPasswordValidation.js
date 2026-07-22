const { body, validationResult } = require("express-validator");

const passwordValidation = [
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 5, max: 50 })
    .withMessage("password must be between 5 and 50 characters"),
];

const passwordValidate = (req, res, next) => {
  const errors = validationResult(req);
console.log(errors)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  next();
};



module.exports = {
  passwordValidation,
  passwordValidate,
};