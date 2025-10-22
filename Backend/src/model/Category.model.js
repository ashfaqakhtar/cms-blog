import mongoose, { Schema } from "mongoose";
import slugify from "slugify";


const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });


categorySchema.pre("validate", function (next) {
    if (this.categoryName && !this.slug) {
        this.slug = slugify(this.categoryName, { lower: true, strict: true });
    }
    next();
})


const Category = mongoose.model("Category", categorySchema)

export default Category;