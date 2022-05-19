const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        postId: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("submission", submissionSchema)