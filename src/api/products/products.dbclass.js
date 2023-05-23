import mongoose from "mongoose";
import { paginate } from "mongoose-paginate-v2";
import productsModel from "./products.model.js";

class ProductManagerDB {
    constructor () {
        this.products = [];
        this.latestId = 1;
        this.statusMsg = "PRODUCTMANAGERDB inicializado";
    } 

    async load() {
        try {
            const data = productsModel;
            products = JSON.parse(data);
            console.log('Data loaded successfully');
        } catch (error) {
            console.log(error);
            throw new Error('Error loading data');
        }
    }

    async addProduct (data) {
        
        if (!data.title || !data.description || !data.price || !data.thumbnail || !data.code || !data.stock || !data.status || !data.category) {
            console.log("Error: All fields are mandatory");
            return; 
        }  else {
            const found = this.products.some((product) => data.code === product.code);;
            if (found) {
                console.log(`Error: There is already a product with id ${code}`);
                return;
            } else {
                const newProduct = new productsModel( {
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    thumbnail: data.thumbnail,
                    code: data.code,
                    stock: data.stock,
                    status: data.status, 
                    category: data.category,
                    id: parseInt(Math.random() * 10) //tuve que hacerlo así porque el método que yo usaba antes dejó de funcionar
                });

                try {
                    const savedProduct = await newProduct.save();
                    console.log("product added as expected");
                    return savedProduct;
                } catch (error) {
                    console.log("Error occurred while saving the product:", error)

                }
                
            };
        };
    };

    async getProducts() {
        try {
            const data = await productsModel.find().lean();
            //const products =  JSON.parse(data);
            return data;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    async getProductById(productId) {
        const parsedProductId = parseInt(productId)
        const product = await productsModel.findOne({id: parsedProductId}).lean(); 
        //const productsById = JSON.parse(data);
        //const product = data.find(product => product.id === productId);
        if (product) {
            console.log(product);
            return product; 
        } else {
            console.log("Error: product not found");
        }
    } 

    async updateProduct (productId, field, updateData) {
        try {
            if (updateData === undefined || Object.keys(updateData).length === 0) {
                this.status = -1;
                this.statusMsg = "There must be data in the req body";
            } else {
                const process = await productsModel.updateOne({ '_id': new mongoose.Types.ObjectId(productId) }, updateData);
                this.status = 1;
                process.modifiedCount === 0 ? this.statusMsg = "ID doe snot exist or the is no change to be made": this.statusMsg = "Product updated";
            }
        } catch (err) {
            this.status = -1;
            this.statusMsg = `updateProduct: ${err}`;
        }
    }

    async deleteProduct(productId) {
        try {
          const result = await productsModel.deleteOne({ id: productId });
      
          if (result.deletedCount > 0) {
            return true; // Deletion was successful
          } else {
            return false; // Product not found or not deleted
          }
        } catch (error) {
          throw new Error(`Error occurred while deleting product with ID ${productId}: ${error.message}`);
        }
      }

}


export default ProductManagerDB;