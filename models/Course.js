import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    price: {
      type: Number,
      required: true,
      default: 0, // Free by default
    },

  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
