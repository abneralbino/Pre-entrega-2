import mongoose from "mongoose";
import { paginate } from "mongoose-paginate-v2";


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