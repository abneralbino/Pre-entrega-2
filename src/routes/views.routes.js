/* import http from 'http';
import express from 'express';
import { Router as expressRouter } from 'express';
import { __dirname } from '../utils.js';


const viewsRouter = expressRouter();
const appEx = express ();
const httpServer = http.createServer(appEx);


import ProductManager from '../api/products/products.class.js';
import ProductManagerDB from '../api/products/products.dbclass.js';
import bodyParser from 'body-parser';

import { Server } from 'socket.io';
import server from '../server.js'; */

import { Router } from "express";
import ProductManagerDB from "../api/products/products.dbclass.js";
import { __dirname } from "../utils.js";
import bodyParser from 'body-parser';

const viewsRouter = Router();
const productManagerDB = new ProductManagerDB();


const handlebarsViewsRouter = (io) => {

const productManager = new ProductManagerDB();

  viewsRouter.use(bodyParser.urlencoded({ extended: true }));
  //viewsRouter.use(express.json());

  let products = [];

  io.on('connection', (socket) => {
    console.log('User connected from views.routes');
    
    viewsRouter.get('/realtimeproducts', async (req, res) => { 
      try {
      await ProductManagerDB.load();
      const showProducts = await ProductManagerDB.getProducts();
      res.render('realTimeProducts', {showProducts});
      console.log("realtimeproducts static endpoint is working is working" , showProducts);
      } catch (error) {
        res.status(500).send({error: error.message});
      }
    }); 

    /* socket.on('add_product', async (product) => {
      console.log (`Receiving product`, product);

      let products = new ProductManagerDB()

      products.addProduct(product)
      .then(() => {
          console.log('Product successfuly added')
          //res.render('realTimeProducts', {products});
      })
      .catch((err) => {
          console.log(`Error when trying to add product`)
      });
    }); */

    socket.on('delete_product', async (id) => { // Escuchando 'delete_product' 
        console.log(`Receiving request to delete product ${id}`);
        let products =  new ProductManagerDB()
        products.deleteProduct(parseInt(id))
        //res.render('realTimeProducts', {products})
        .then(() => {
            console.log(`Product ID ${id} successfuly deleted`);
        })
        .catch((err) => {
            console.log(`Error when trying to delete ID ${id}: ${err.message}`)
        })
    });

    

  });

  return handlebarsViewsRouter;

};

export default handlebarsViewsRouter;


/* viewsRouter.delete ('/realtimeproducts/:pid', async (req, res) => {
  const deleteById = parseInt(req.params.pid);

  res.send(await ProductManagerDB.deleteProduct(deleteById));
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
  
  res.send(await ProductManagerDB.addProduct(transport)); */

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

/* socket.on('delete_product', async (id) => { // Escuchando 'delete_product' 
    const deleteProdIo = await productManager.deleteProduct(id); 
    console.log('Delete_product from views.routes activated');
  }); */




/* viewsRouter.delete ('/realtimeproducts/:pid', async (req, res) => {
  const deleteById = parseInt(req.params.pid);

  res.send(await productManager.deleteProduct(deleteById));
  console.log(deleteById);
}); */
