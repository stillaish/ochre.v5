const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^\+91[6-9]\d{9}$/).required(),
  location: Joi.object({
    latitude: Joi.number().min(6).max(37).required(),
    longitude: Joi.number().min(68).max(97).required(),
    address: Joi.string().required()
  }).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Hazard validation schemas
const hazardSchema = Joi.object({
  type: Joi.string().valid('flood', 'fire', 'earthquake', 'landslide', 'storm', 'other').required(),
  description: Joi.string().min(10).max(500).required(),
  location: Joi.object({
    latitude: Joi.number().min(6).max(37).required(),
    longitude: Joi.number().min(68).max(97).required(),
    address: Joi.string().required()
  }).required(),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
  images: Joi.array().items(Joi.string()).max(5).optional()
});

// Weather alert validation schema
const weatherAlertSchema = Joi.object({
  type: Joi.string().valid('cyclone', 'storm', 'heavy_rain', 'flood_warning', 'heat_wave', 'other').required(),
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
  location: Joi.object({
    latitude: Joi.number().min(6).max(37).required(),
    longitude: Joi.number().min(68).max(97).required(),
    address: Joi.string().required()
  }).required(),
  validFrom: Joi.date().required(),
  validUntil: Joi.date().greater(Joi.ref('validFrom')).required()
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  hazardSchema,
  weatherAlertSchema,
  validate
};
