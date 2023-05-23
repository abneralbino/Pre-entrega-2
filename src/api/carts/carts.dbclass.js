import cartsModel from "./carts.model.js";
import mongoose from "mongoose";
import { paginate } from "mongoose-paginate-v2";


class cartsManagerDB {
    constructor () {
        this.carts = [];
        this.latestId = 1;
        //this.path = './Data/carts.JSON';
    };

    async addCart (cartData) {
        const newCart = {
            id: parseInt(Math.random() * 100), //tuve que hacerlo así porque el método que yo usaba antes dejó de funcionar
            products: []
        };
        
        await cartsModel.save(newCart)
        console.log("New cart successfuly added");
            
    };     
    

    async getCartById(cartId) {
        const data = await cartsModel.find(cartId)
        const cartsData = JSON.parse(data);

        const cart = cartsData.find(cartData => cartData.id === cartId);
        if (cart) {
            //console.log(cart);
            return cart.products; 
        } else {
            console.log("Error: cart not found - from carts.class.js");
        }
    } 


    async addProductToCart (cartId, cartProductId, cartProductQuantity) {
        const data = await cartsModel.find();
        const cartsData = JSON.parse(data);
        
        const cartIndex = cartsData.findIndex(cart => cart.id === cartId);
        
        if (cartIndex === -1) {
            console.log('Error: cart not found');
            return;
        }
        const existingProductIndex = cartsData[cartIndex].products.findIndex(product => product.productId === cartProductId);
        if (existingProductIndex !== -1) {
            cartsData[cartIndex].products[existingProductIndex].quantity += cartProductQuantity;
        } else {
            const cartProduct = {
            productId: cartProductId,
            quantity: cartProductQuantity
            }
            cartsData[cartIndex].products.push(cartProduct);
        }

        await data.save(JSON.stringify(cartsData));
        console.log("In-cart product was updated");
        
    }


}

export default cartsManagerDB;
