import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
  blog: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  likesCount: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null
  }
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
