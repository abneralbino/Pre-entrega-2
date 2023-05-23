import { Router } from 'express';
import ProductManager from './products.class.js';
import express from 'express';
import bodyParser from 'body-parser';
import productsModel from './products.model.js'
import ProductManagerDB from './products.dbclass.js';
import { paginate } from 'mongoose-paginate-v2';



let products = [];

const productsRouter = (io) => {

const router = Router();
const productManager = new ProductManager();
const productManagerDB = new ProductManagerDB();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json()) ;

  router.get('/products', async (req, res) => {
    try {
      const showProducts = await productManagerDB.getProducts();
      res.render('realTimeProducts', {showProducts});
      //  res.status(200).send({status: 'OK', data: showProducts});
      } catch (error) {
        res.status(500).send({error: error.message});
      }
    
  });
  
   router.get('/products/:pid', async (req, res) => { //probar directamente de la URL con http://localhost:3000/api/products/<ID> 
    const productId = req.params.pid;
    try {
      const product = await productManagerDB.getProductById(productId);
  
      if (!product) {
        res.status(404).send(`${productId} Not found`);
      } else {
        //res.render('realTimeProducts', {product})
        return res.status(200).send(product);
      }
    } catch (error) {
      res.status(500).send({error: error.message});
    }
  }); 
  
  router.post ('/products', async (req, res) =>{
    const newProduct = req.body;
    io.emit('add_product', req.body);
    
    const data = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      thumbnail: req.body.thumbnail,
      code: req.body.code,
      stock: req.body.stock,
      status: req.body.status,
      category: req.body.category,
    
    }
    
    res.send(await productManagerDB.addProduct(data));
    console.log(data);
    //res.render('realTimeProducts')
  });
  
  router.put('/products/:pid/:field', async (req, res) => {
  
  const productId = parseInt(req.params.pid);
  const field = req.params.field;
  const updateData = req.body;
  
  
  res.send(await productManagerDB.updateProduct(productId, field, updateData));
  console.log(productId);
  console.log(field);
  console.log(updateData);
  
  }); 
  
  router.delete ('/products/:pid', async (req, res) => {
    socket.on('delete_product', async (id) => {
      console.log(`Received request to delete product ${id}`);
    
      try {
        // Call the appropriate method in productManagerDB to delete the product
        const result = await productManagerDB.deleteProduct(id);
    
        if (result) {
          console.log(`Product with ID ${id} successfully deleted`);
          io.emit('product_deleted', id);
        } else {
          console.log(`Product with ID ${id} not found`);
        }
      } catch (error) {
        console.log(`Error occurred while deleting product with ID ${id}: ${error.message}`);
      }
    });
  });

  return router;
  
};

export default productsRouter;
