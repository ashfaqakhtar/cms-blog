import Blog from "../model/Blog.model.js"
import Category from "../model/Category.mode.js"

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


export {
    createBlog
}