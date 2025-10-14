import mongoose from "mongoose";
const AuthorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    bio: String,
    avatarUrl: String,
    social: {
        twitter: String,
        linkedin: String,
    }
}, { timestamps: true });
export default mongoose.model("Author", AuthorSchema);
