// name, email, photo, password, passwordConfirm
const crypto = require('node:crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const passwordMinLength = 8;
const passwordMaxLength = 30;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name.'],
    unique: true,
    trim: true,
  },
  verifiedEmail: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    select: false,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email.'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email address is not valid.'],
  },
  photo: {
    type: String,
    default: 'default-user.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [
      passwordMinLength,
      `Password should be more than or equal to ${passwordMinLength} characters`,
    ],
    maxlength: [
      passwordMaxLength,
      `Password should be less than or equal to ${passwordMaxLength} characters`,
    ],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      message: 'Password does not match!',
      validator: function (passConfirm) {
        return passConfirm === this.password;
      },
    },
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  active: {
    type: Boolean,
    select: false,
    default: true,
  },
});

userSchema.methods.createEmailVerificationToken = function () {
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(emailVerificationToken)
    .digest('hex');

  return emailVerificationToken;
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', async function (next) {
  // Only run if password was modified.
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const saltCost = 12;
  this.password = await bcrypt.hash(this.password, saltCost);
  this.passwordConfirm = undefined;
  this.passwordChangedAt = Date.now() - 1e3;

  next();
});

userSchema.methods.passwordMatch = async function (testPassword) {
  if (!testPassword) {
    return false;
  }
  return await bcrypt.compare(testPassword, this.password);
};

userSchema.methods.signToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (!this.passwordChangedAt) return false;
  const changedTimestamp = Math.floor(
    this.passwordChangedAt.getTime() / 1e3,
    10,
  );
  return changedTimestamp > JWTTimestamp;
};

userSchema.methods.createPasswordResetToken = function (expireTime) {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + expireTime * 60 * 1000;

  return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
