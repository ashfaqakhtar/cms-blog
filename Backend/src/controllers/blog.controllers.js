import mongoose from "mongoose"
import Blog from "../model/Blog.model.js"
import Category from "../model/Category.model.js"

const createBlog = async (req, res) => {

    const { title, content, excerpt, thumbnail, category, tags, status, } = req.body

    const requiredFields = ["title", "content", "excerpt", "thumbnail", "category", "status"]


    for (let fields of requiredFields) {
        if (!req.body[fields]) {
            return res.status(400).json({
                success: false,
                message: `${fields} are required !`
            })
        }
    }

    const categoryExists = await Category.findById(category)

    if (!categoryExists) {
        return res.status(400).json({
            success: false,
            message: "Invalid Category"
        })
    }

    const author = req.user._id;

    if (!author) {
        return res.status(400).json({
            success: false,
            message: "Invalid Author ! Select Author Name"
        })
    }

    let publishedAt = null;

    if (status === "published") {
        publishedAt = Date.now();
    }

    const blogTags = tags || []

    try {
        const newBlog = await Blog.create({
            title,
            content,
            excerpt,
            thumbnail,
            category,
            tags: blogTags,
            status,
            author,
            publishedAt
        });

        return res.status(201).json({
            success: true,
            message: "Blog Created Successfully !!",
            data: newBlog
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error !! Can not create Blog",
            error: error.message
        })
    }

}

const getAllBlogs = async (req, res) => {
    const { page = 1, limit = 10, category, status, search } = req.query;

    try {
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.min(parseInt(limit, 10) || 10, 100);
        const skip = (pageNumber - 1) * limitNumber;

        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
            ];
        }

        const blogs = await Blog.find(filter)
            .populate("author", "name email")
            .populate("category", "categoryName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        const totalBlog = await Blog.countDocuments(filter);

        return res.status(200).json({
            success: true,
            totalBlog,
            currentPage: pageNumber,
            totalPage: Math.ceil(totalBlog / limitNumber),
            blogs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching blogs!",
            error: error.message,
        });
    }
};

const getBlogById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Blog Id"
            });
        }

        const blog = await Blog.findById(id)
            .populate("author", "name email role")
            .populate("category", "categoryName")
            .populate({
                path: "comments",
                populate: { path: "user", select: "name email" }
            });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully!",
            data: blog
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error! Failed to fetch blog",
            error: error.message
        });
    }
};

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, excerpt, thumbnail, category, tags, status } = req.body;

       
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Blog ID!",
            });
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found!",
            });
        }

      
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category ID!",
                });
            }
        }

   
        const updatedData = {
            title,
            content,
            excerpt,
            thumbnail,
            category,
            tags,
            status,
        };

        // remove undefined values to avoid overwriting with `undefined`
        Object.keys(updatedData).forEach((key) => {
            if (updatedData[key] === undefined) delete updatedData[key];
        });

        // 🧠 5️⃣ Auto-update publishedAt if status changed to "published"
        if (status === "published" && !blog.publishedAt) {
            updatedData.publishedAt = Date.now();
        }

        // 🧠 6️⃣ Update blog
        const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, {
            new: true, // return updated document
            runValidators: true, // re-run schema validation
        })
            .populate("author", "name email")
            .populate("category", "name");

        // 🧠 7️⃣ Send Response
        return res.status(200).json({
            success: true,
            message: "Blog updated successfully!",
            data: updatedBlog,
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error while updating blog!",
        });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        // 🧠 1️⃣ Validate Blog ID
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Blog ID!",
            });
        }

        // 🧠 2️⃣ Find Blog
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found!",
            });
        }

        // 🧠 3️⃣ (Optional) Authorization Check
        // Suppose sirf author ya admin hi delete kar sakta hai
        if (
            req.user.role !== "admin" &&
            req.user.role !== "superadmin" &&
            blog.author.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized! You cannot delete this blog.",
            });
        }

        // 🧠 4️⃣ Delete Blog
        await Blog.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting blog!",
            error: error.message,
        });
    }
};

export {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
}