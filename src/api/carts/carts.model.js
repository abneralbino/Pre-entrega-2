import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    cartId: Number,
    products: {
        id: Number,
        quantity: Number
    }
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;