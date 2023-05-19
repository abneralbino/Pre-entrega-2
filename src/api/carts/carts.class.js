//const fs = require('fs');
import fs from 'fs';

class cartsManager {
    constructor () {
        this.carts = [];
        this.latestId = 1;
        this.path = './Data/carts.JSON';
    } 

    async load() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
            console.log('Carts data loaded successfully');
        } catch (error) {
            console.log(error);
            throw new Error('Error loading carts data');
        }
    };

    async addCart (cartData) {
        const newCart = {
            id: parseInt(Math.random() * 100), //tuve que hacerlo así porque el método que yo usaba antes dejó de funcionar
            products: []
        };
        
        this.carts.push (newCart);
        console.log("New cart successfuly added");
    
        fs.readFile(this.path, 'utf-8', (err, cartData) => {
            if (err) {
                console.log(err);
                return;
            }
            let cart = [];

            if (cartData) {
                try {
                    cart = JSON.parse(cartData);
                } catch {
                    console.log('Error parsing JSON string:');
                    return;
                }
            }

            cart.push(newCart);

            fs.writeFile(this.path, JSON.stringify(cart), (err) => {
                if (err) throw err;
                console.log('File successfuly saved');
            });
        });
    };     
    

    async getCartById(cartId) {
        const data = await fs.promises.readFile(this.path, 'utf-8'); 
        const cartsData = JSON.parse(data);

        const cart = cartsData.find(cartData => cartData.id === cartId);
        if (cart) {
            //console.log(cart);
            return cart.products; 
        } else {
            console.log("Error: cart not found - carts.class.js");
        }
    } 


    async addProductToCart (cartId, cartProductId, cartProductQuantity) {
        const data = await fs.promises.readFile(this.path, 'utf-8');
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

        await fs.promises.writeFile(this.path, JSON.stringify(cartsData));
        console.log("In-cart product was updated");
        
    }


}

export default cartsManager;

/*PARA PROBAR

{
    "title": "pants",
    "description": "panties",
    "price": 50000,
    "thumbnail": "paaants",
    "code": "pant123",
    "stock": 2,
    "status": true,
    "category": "pants"
}*/

/*,{
    "title": "shirt",
    "description": "shirt",
    "price": 500,
    "thumbnail": "cool shirt",
    "code": "shir123",
    "stock": 10,
    "status": true,
    "category": "shirts"
},{
    "title": "socks",
    "description": "socks that sucks",
    "price": 50,
    "thumbnail": "soooocks",
    "code": "SO123",
    "stock": 30,
    "status": true,
    "category": "underwear"
}*/






