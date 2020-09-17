const express = require('express');
const Product = require('../models/products');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autentication');
const app = express();


// Obtengo los productos
app.get('/products', verificaToken, function (req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let lim = req.query.lim || 5;
    lim = Number(lim);

    Product.find({ status: true })
        .skip(desde)
        .limit(lim)
        .exec((err, productsDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }

            Product.count({ status: true }, (error, conteo) => {

                if (error) {
                    return res.status(400).json({
                        ok: false,
                        message: error
                    })
                }

                res.json({
                    ok: true,
                    productos: productsDB,
                    total: conteo
                });
            })
        });

});

// Obtengo un producto
app.get('/products/:id', verificaToken, function (req, res) {
    let id = req.params.id

  Product.findById( id, (err, productsDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      })
    }

    if (!productsDB) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'El producto que intenta consultar no existe en la BD'
        }
      });
    }

    res.json({
      ok: true,
      producto: productsDB
    })
  })
  
});

// Almaceno o posteo un producto
app.post('/products',[verificaToken, verificaAdminRole], function (req, res) {
    let body = req.body;
    let product = new Product({
        name: body.name,
        price_unit: body.price_unit,
        category: body.category,
        stock: body.stock,
        user: body.user,
        status: body.status
    });

    product.save((err, ProductDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }

        res.json({
            ok: true,
            product: ProductDB
        });
    });
});

// Actualizo un producto
app.put('/products/:id', [verificaToken, verificaAdminRole], function (req, res) {
    let id = req.params.id;
    let body = _.pick( req.body, ['name', 'price_unit', 'category', 'stock', 'user', 'status']);

    Product.findByIdAndUpdate( id, body, { new: true, runValidators: true, context: 'query' }, (err, productsDB) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          message: err
        });
      }

      res.json({
        ok: true,
        producto_actualizado: productsDB
      });
    });

  });


// Elimino un producto (actualizar)
app.delete('/products/:id', [verificaToken, verificaAdminRole],function (req, res) {
    let id_producto = req.params.id;
    
    let changeState = {
      status: false
    };

    Product.findByIdAndUpdate(id_producto, changeState, { new: true}, (err, productDeleted) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: err
        });
      }

      if (productDeleted === null) {
        return res.status(400).json({
          ok: false,
          error: {
            message: 'El producto que intenta eliminar no existe en la BD'
          }
        });
      }

      res.json({
        ok: true,
        producto_eliminado: productDeleted
      });

    });

    // Eliminado Físico en la BD
  //
  // User.findByIdAndRemove(id_usuario, (err, productDeleted) => {

  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       message: err
  //     });
  //   }

  //   if (productDeleted === null) {
  //     return res.status(400).json({
  //       ok: false,
  //       error: {
  //         message: 'El producto que intenta eliminar no existe en la BD'
  //       }
  //     });
  //   }

  //   res.json({
  //     ok: true,
  //     producto_eliminado: productDeleted
  //   });

  // });

});

module.exports = app;

