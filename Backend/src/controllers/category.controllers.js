import mongoose from "mongoose";
import Category from "../model/Category.model.js";
import slugify from "slugify";


const createCategory = async (req, res) => {

    const { categoryName, description } = req.body;

    try {

        if (!categoryName) {
            return res.status(400).json({
                success: false,
                message: "Please enter Category Name"
            })
        }

        const existingCategory = await Category.findOne({ categoryName })

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category Already Exist"
            })
        }

        const category = new Category({ categoryName, description })

        await category.save()

        return res.status(201).json({
            success: true,
            message: "Category Added Successfully",
            data: category
        })

    } catch (error) {
        return res.status(501).json({
            status: false,
            message: "Internel Server error ! Cant create category",
            error: error.message
        })
    }

}

const getAllCategory = async (req, res) => {
    const { page, limit, search } = req.query;

    try {
        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const pageLimit = Math.min(parseInt(limit, 10) || 10, 100);
        const skip = (pageNumber - 1) * pageLimit;

        let filter = {};

        if (search) {
            filter.categoryName = { $regex: search, $options: "i" }; // case-insensitive search
        }

        const categories = await Category.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageLimit);

        const totalCategories = await Category.countDocuments(filter);

        return res.status(200).json({
            success: true,
            totalCategories,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalCategories / pageLimit),
            data: categories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error! Can't fetch categories",
            error: error.message,
        });
    }
};

const getCategoryById = async (req, res) => {

    const { id } = req.params

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Can not find category !"
            })
        }

        const category = await Category.findById(id)

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Invalid Category ID!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Category found!",
            data: category,
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internel server error ! Error getting category"
        })
    }


}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { categoryName, description } = req.body;

    try {
        // 1️⃣ Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID!",
            });
        }

        // 2️⃣ Check if category exists by ID
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found!",
            });
        }

        // 3️⃣ Validate categoryName
        if (!categoryName) {
            return res.status(400).json({
                success: false,
                message: "Please enter category name!",
            });
        }

        // 4️⃣ Prepare updated data
        const updatedData = {
            categoryName,
            description,
        };

        // Remove undefined fields (if any)
        Object.keys(updatedData).forEach((key) => {
            if (updatedData[key] === undefined) delete updatedData[key];
        });

        // 5️⃣ Update slug if categoryName changed
        if (updatedData.categoryName) {
            updatedData.slug = slugify(updatedData.categoryName, { lower: true, strict: true });
        }

        // 6️⃣ Update in DB
        const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, {
            new: true, // return the updated document
            runValidators: true, // run schema validations
        });

        // 7️⃣ Send success response
        return res.status(200).json({
            success: true,
            message: "Category updated successfully!",
            data: updatedCategory,
        });
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error! Cannot update category.",
            error: error.message,
        });
    }
};

const deleteCategory = async (req, res) => {

    const { id } = req.params;

    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category id"
            })
        }

        const existingCategory = await Category.findById(id)

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        await Category.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully !!"
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error! Can't delete category"
        })
    }
}

export {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}