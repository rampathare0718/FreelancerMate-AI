import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Optional to allow standalone AI analysis before user signup/linking
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    clientRequest: {
      type: String,
      required: true,
      trim: true
    },
    budget: {
      type: Number
    },
    deadline: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'analyzed', 'completed'],
      default: 'pending'
    },
    analysis: {
      summary: {
        type: String
      },
      requirements: [
        {
          type: String
        }
      ],
      techStack: {
        type: Object
      },
      architecture: {
        type: String
      },
      roadmap: [
        {
          type: String
        }
      ],
      missingQuestions: [
        {
          type: String
        }
      ],
      timeEstimate: {
        type: String
      },
      pricingEstimate: {
        type: String
      },
      proposal: {
        type: String
      }
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;
