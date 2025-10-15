import mongoose, { Schema } from "mongoose";

const likeSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
    ipAddress: {
        type: String,
    },
}, { timestamps: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;
