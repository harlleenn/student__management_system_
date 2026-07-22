const { body, validationResult } = require("express-validator");

const studentValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("course")
    .isLength({ min: 3, max:10})
    .isAlphanumeric()
    // .matches(/^[A-Za-z\s]+$/)
    .withMessage("Please enter a valid course name"),
];

const studentValidate = (req, res, next) => {
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
  studentValidation,
  studentValidate,
};