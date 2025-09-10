import mongoose from 'mongoose';

const hazardReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['earthquake', 'flood', 'cyclone', 'fire', 'landslide', 'drought', 'storm', 'other']
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  aiVerification: {
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    reasons: [String],
    processedAt: Date
  },
  images: [String], // URLs to uploaded images
  contactInfo: {
    phone: String,
    email: String
  },
  affectedPeople: {
    type: Number,
    min: 0
  },
  isEmergency: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for geospatial queries and status filtering
hazardReportSchema.index({ location: '2dsphere' });
hazardReportSchema.index({ status: 1 });
hazardReportSchema.index({ type: 1 });
hazardReportSchema.index({ createdAt: -1 });

export default mongoose.model('HazardReport', hazardReportSchema);