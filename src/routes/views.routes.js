import http from 'http';
import express from 'express';
import { Router as expressRouter } from 'express';


const viewsRouter = expressRouter();
const appEx = express ();
const httpServer = http.createServer(appEx);


import ProductManager from '../api/products/products.class.js';
import bodyParser from 'body-parser';

import { Server } from 'socket.io';
import server from '../server.js';

//const io = new Server(httpServer);


const handlebarsViewsRouter = (io) => {

const productManager = new ProductManager();

viewsRouter.use(bodyParser.urlencoded({ extended: true }));
viewsRouter.use(express.json());

let products = [];


viewsRouter.get('/realtimeproducts', async (req, res) => { 
    try {
    await productManager.load();
    const showProducts = await productManager.getProducts();
    res.render('realTimeProducts', {showProducts});
    console.log("realtimeproducts static endpoint is working is working" , showProducts);
    } catch (error) {
      res.status(500).send({error: error.message});
    }
  
}); 

io.on('connection', (socket) => {
  console.log('User connected trying to DELETE');

  socket.on('delete_product', async (id) => { // Escuchando 'delete_product' 
    const deleteProdIo = await productManager.deleteProduct(id); // Delete product por ID usando deleteProduct()
    console.log('WHY AM I NOT SHOWING?! ROUTER');
  });

});


io.on('delete_product', async (id) => { // Escuchando 'delete_product' 
  console.log(`Receiving request to delete product ${id}`);
  let products =  new ProductManager()

  products.deleteProduct(parseInt(id))
  .then(() => {
      console.log(`Product ID ${id} successfuly deleted`);
  })
  .catch((err) => {
      console.log(`Error when trying to delete ID ${id}: ${err.message}`)
  })
      
  });

  io.on('add_product', async (product) => {
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
 

  

 viewsRouter.delete ('/realtimeproducts/:pid', async (req, res) => {
  const deleteById = parseInt(req.params.pid);

  res.send(await productManager.deleteProduct(deleteById));
  console.log(deleteById);
}); 

 viewsRouter.post ('/realtimeproducts', async (req, res) =>{
  const newProduct = req.body;

  const transport = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    thumbnail: req.body.thumbnail,
    code: req.body.code,
    stock: req.body.stock,
    status: req.body.status,
    category: req.body.category,
  
  }
  
  res.send(await productManager.addProduct(transport));
  
}); 

return handlebarsViewsRouter;

};






/* viewsRouter.delete ('/realtimeproducts/:pid', async (req, res) => {
  const deleteById = parseInt(req.params.pid);

  res.send(await productManager.deleteProduct(deleteById));
  console.log(deleteById);
}); */

/* viewsRouter.post ('/realtimeproducts', async (req, res) =>{
  const newProduct = req.body;

  const transport = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    thumbnail: req.body.thumbnail,
    code: req.body.code,
    stock: req.body.stock,
    status: req.body.status,
    category: req.body.category,
  
  }
  
  res.send(await productManager.addProduct(transport));
  
}); */

export default handlebarsViewsRouter;

