//Los IMPORTS
import {} from 'dotenv/config';
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';

import productsRouter from './api/products/products.routes.js';
import cartsRouter from './api/carts/carts.routes.js';
import handlebarsViewsRouter from './routes/views.routes.js';

import { __dirname } from './utils.js';

const PORT = parseInt(process.env.PORT) || 3000;
const MONGOOSE_URL = process.env.MONGOOSE_URL;

//SERVIDOR EXPRESS
const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false
    }
});


//Eventos socket.io
io.on('connection', (socket) => {
    console.log(`New client connected (${socket.id}) IO`);

    socket.emit('server_confirm', 'Connection received IO');

    socket.on("disconnect", (reason) => {
        console.log(`'client disconnected (${socket.id}): ${reason}`);
    });

    socket.on('event_cl_01', (data) => {
        console.log('APP.JS socket connected', data);
        socket.emit('confirm', 'server.js client connection received');
    })

    socket.on('product_deleted', async (id) => { // Escuchando 'delete_product' 
        console.log(`Receiving request to delete product ${id}`);
        let products = new ProductManager()

        products.deleteProduct(parseInt(id))
        .then(() => {
            console.log(`Product ID ${id} successfuly removed`);
        })
        .catch((err) => {
            console.log(`Error trying to delete product ID ${id}: ${err.message}`)
        });
        
    });

    socket.on('product_added', async (product) => {
        console.log (`Receiving product`, product);

        let products = new ProductManager()

        products.addProduct(product)
        .then(() => {
            console.log('Product successfuly added')
        })
        .catch((err) => {
            console.log(`Error when trying to add product`)
        })

        
    });


});

app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

//Endpoints API rest
app.use('/api', productsRouter(io));
app.use('/api', cartsRouter(io));
app.use('/api', handlebarsViewsRouter(io));

//CONTENIDOS ESTÁTICOS
app.use(express.static('views')); //cambiarlo a public para acceder a index.html
app.use('/', express.static(`${__dirname}/public`));


//TEMPLATE ENGINE - MOTOR DE PLANTILLAS
app.engine ('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.set('views', './views');

try {
    await mongoose.connect(MONGOOSE_URL);
    server.listen(PORT, () => {
    console.log(`API/Socket.io server started in port ${PORT}`);
});
} catch(err) {
    console.log('Could not connect to database server' + err);

};




export default server;
//
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