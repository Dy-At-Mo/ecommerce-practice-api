import express from "express";
import { createDB } from "../db.js";
import { validateBody } from "../middleware/validateBody.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkRole } from "../middleware/checkRole.js";
import { productSchema } from "../schema/product.schema.js";


export const productsRouter = express.Router();

const db = createDB();




// Get all products && search
productsRouter.get("/", async (req, res, next) => {
  try {
    // Get search from query
    const search = req.query.search;

    // Get all products
    const products = await db.getAll("products");

    // If there is search
    if (search) {
      const filteredProducts = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
        );
      });

      return res.status(200).json({
        data: filteredProducts,
      });
    }

    // If there is no search
    return res.status(200).json({
      data: products,
    });
  } catch (err) {
    next(err);
  }
});


// Create Product  # merchant
productsRouter.post("/" , checkAuth , checkRole("merchant") , validateBody(productSchema) ,  async (req, res, next) =>{
     try {
      // Get data from request body
      const productData = req.body;

      // Save product in database
      const newProduct = await db.create(
        "products",
        productData
      );

      // Send response
      return res.status(201).json({
        data: newProduct,
      });
    } catch (err) {
      next(err);
    }
  }
);


// Get by id

productsRouter.get("/:product_id" ,  async (req, res, next) =>{
     try {

        // Get product ID from params
        const productId = req.params.product_id;

       // Get data from request body
        const product = await db.getById("products", productId);

       // chaik If product dont exist
        if (!product) {
            return res.status(404).json({
                error: "product not found",
           });
        }

       // Send response
        return res.status(200).json({
            product,
         });
    } catch (err) {
      next(err);
    }
  }
)



// Update

productsRouter.patch( "/:product_id", checkAuth, checkRole("merchant") , validateBody(productSchema.partial()) ,  async (req, res, next)=>{
    try{
        // Get product ID from params
        const productId = req.params.product_id;

        // check database
        const product = await db.getById("products", productId);

        // chaik If product dont exist
        if (!product) {
            return res.status(404).json({
                error: "product not found",
           });
        }

        // get data from body
        // update in database
        await db.update("products" , productId , req.body)
        const newProduct = await db.getById("products", productId);

        // Send response
        return res.status(200).json({
            "message": "product updated successfully",
             data: newProduct,
         });



    }catch(err){
        next(err);
    }

})


// Delete

productsRouter.delete( "/:product_id", checkAuth, checkRole("merchant") , async (req, res, next)=>{
    try{
        // Get product ID from params
        const productId = req.params.product_id;

        // check database
        const product = await db.getById("products", productId);

        // Check if product exists
        if (!product) {
            return res.status(404).json({
            error: "product not found",
            });
        }

        // Delete product
        await db.delete("products", productId);

        //Response
        return res.status(204).send();

    }catch(err){
        next(err);
    }

})
