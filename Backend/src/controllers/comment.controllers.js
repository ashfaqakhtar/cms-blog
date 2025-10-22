import mongoose from "mongoose";
import Comment from "../model/Comment.model.js";
import Blog from "../model/Blog.model.js";

const addComment = async (req, res) => {
    const { content, parentComment } = req.body;
    const { blogId } = req.params;

    try {
        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Please write a comment!",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Blog Id",
            });
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Please login to comment!",
            });
        }

        const newComment = await Comment.create({
            blog: blogId,
            user: req.user._id,
            content,
            parentComment: parentComment || null,
        });

        await Blog.findByIdAndUpdate(blogId, {
            $push: { comments: newComment._id },
        }, { new: true });

        return res.status(201).json({
            success: true,
            message: "Comment added successfully!",
            data: newComment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error! Cannot add comment",
            error: error.message,
        });
    }
};

const showComment = async (req, res) => {
    const { blogId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Blog Id",
            });
        }

        const existingBlog = await Blog.findById(blogId);

        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found!",
            });
        }

        const comments = await Comment.find({ blog: blogId })
            .populate("user", "name email")
            .populate("parentComment", "content")
            .sort({ createdAt: -1 });

        if (!comments || comments.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No comments yet for this blog!",
                comments: [],
            });
        }

        return res.status(200).json({
            success: true,
            count: comments.length,
            comments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error! Cannot fetch comments",
            error: error.message,
        });
    }
};


const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Comment Id",
            });
        }

        // Check content
        if (!content || content.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Comment content cannot be empty",
            });
        }

        // Find comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        // Authorization: only owner can update
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this comment",
            });
        }

        // Update content
        comment.content = content;
        await comment.save();

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            data: comment,
        });

    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error! Cannot update comment",
        });
    }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Comment Id",
            });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        // Authorization: only owner or admin can delete
        if (
            comment.user.toString() !== req.user._id.toString() &&
            req.user.role !== "Admin" &&
            req.user.role !== "SuperAdmin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment",
            });
        }

        // Remove from blog's comment list
        await Blog.findByIdAndUpdate(comment.blog, {
            $pull: { comments: comment._id },
        });

        // Delete the comment
        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error! Cannot delete comment",
        });
    }
};


export { addComment, showComment, updateComment, deleteComment };
