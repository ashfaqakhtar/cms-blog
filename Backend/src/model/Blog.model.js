import mongoose, { Schema } from "mongoose";
import slugify from 'slugify'


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        trim: true
    },
    thumbnail: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    likes: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
        required: true
    },
    publishedAt: {
        type: Date
    },
    viewsCount: {
        type: Number,
        default: 0
    },

}, { timestamps: true })


blogSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
})

blogSchema.pre("save", function (next) {
    if (this.excerpt && this.content) {
        this.excerpt = this.content.substring(0, 100)
    }
    next()
})

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;