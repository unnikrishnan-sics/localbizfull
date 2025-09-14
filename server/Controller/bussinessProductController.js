const bussinessProductModel = require("../Models/bussinessProductModel");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        const prefix = "product-";
        const fullName = file.originalname;
        const extension = file.originalname.split(".").pop();
        const fileName = prefix + fullName.substring(0, fullName.lastIndexOf(".")) + Date.now() + "." + extension;
        cb(null, fileName);
    } 
});

const uploadProductPic = multer({ storage: storage }).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'ads', maxCount: 5 } // Allow up to 5 ads images
]);

const addbussinessProduct = async (req, res) => {
    try {
        const { productName, productDescription, weight, price, stockavailable, discountPrice, specialOffer, category } = req.body;
        const photo = req.files['photo']?.[0];
        const ads = req.files['ads'] || [];

        // Validation
        if (!photo) {
            return res.status(400).json({ message: "Product photo is required" });
        }
        if (ads.length === 0) {
            return res.status(400).json({ message: "At least one ad image is required" });
        }

        const bussinessId = req.user.id;
        
        const newbussinessProduct = new bussinessProductModel({
            productName,
            productDescription,
            weight,
            price,
            stockavailable,
            discountPrice,
            specialOffer,
            category,
            photo,
            ads,
            bussinessId
        });
        
        await newbussinessProduct.save();
        res.status(200).json({
            message: "Business Product added successfully",
            data: newbussinessProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const editBussinessProducts = async (req, res) => {
    try {
        const { productName, productDescription, weight, price, stockavailable, discountPrice, specialOffer, category } = req.body;
        const photo = req.files['photo']?.[0];
        const ads = req.files['ads'] || [];
        const productId = req.params.id;

        const updateData = {
            productName,
            productDescription,
            weight,
            price,
            stockavailable,
            discountPrice,
            specialOffer,
            category
        };

        // Only update photo if new one is provided
        if (photo) {
            updateData.photo = photo;
        }

        // Only update ads if new ones are provided
        if (ads.length > 0) {
            updateData.ads = ads;
        }

        const updatedProduct = await bussinessProductModel.findByIdAndUpdate(
            productId,
            updateData,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

const viewBussinessProduct = async (req, res) => {
    try {
        const bussinessId = req.query.bussinessId || req.user.id;
        const products = await bussinessProductModel.find({ bussinessId });
        
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        
        res.status(200).json({
            message: "Business products retrieved successfully",
            data: products
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

const viewSingleProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await bussinessProductModel.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Verify the product belongs to the requesting business
        if (product.bussinessId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to view this product" });
        }

        res.status(200).json({
            message: "Product retrieved successfully",
            data: product
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

const viewProductForCustomer = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await bussinessProductModel.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product retrieved successfully",
            data: product
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

const viewAllProductsForCustomer = async (req, res) => {
    try {
        const businessId = req.params.businessId;
        const products = await bussinessProductModel.find({ bussinessId: businessId });
        
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found for this business" });
        }
        
        res.status(200).json({
            message: "Products retrieved successfully",
            data: products
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

const deleteBussinessProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const bussinessId = req.user.id;

        // Find the product first to ensure it belongs to the authenticated business
        const product = await bussinessProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the product belongs to the current business
        if (product.bussinessId.toString() !== bussinessId) {
            return res.status(403).json({ message: "Unauthorized to delete this product" });
        }

        await bussinessProductModel.findByIdAndDelete(productId);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadProductPic,
    addbussinessProduct,
    editBussinessProducts,
    viewBussinessProduct,
    viewSingleProduct,
    viewProductForCustomer,
    deleteBussinessProduct,
    viewAllProductsForCustomer
};