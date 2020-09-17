const express = require('express');
const Category = require('../models/categories');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autentication');
const app = express();


// Obtengo las categorias
app.get('/categories', verificaToken, function (req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
  
    let lim = req.query.lim || 5;
    lim = Number(lim);
  
      Category.find({ status: true})
          .skip(desde)
          .limit(lim)
          .exec( (err, categoriesDB) => {
            if (err) {
              return res.status(400).json({
                ok: false,
                message: err
              });
            }
  
            Category.count({ status: true}, (error, conteo) => {
  
              if (error) {
                return res.status(400).json({
                  ok: false,
                  message: error
                })
              }
  
              res.json({
                ok: true,
                categorias: categoriesDB,
                total: conteo
              });
            })
          });
  
    });

// Obtengo una categoria
app.get('/categories/:id', verificaToken, function (req, res) {
  let id = req.params.id

  Category.findById( id, (err, categoriesDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      })
    }

    if (!categoriesDB) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'La categoria que intenta consultar no existe en la BD'
        }
      });
    }

    res.json({
      ok: true,
      categoria: categoriesDB
    })
  })
  
});

// Almaceno o posteo una categoria
app.post('/categories', [verificaToken, verificaAdminRole], function (req, res) {
    let body = req.body;
    let category = new Category({
        name: body.name,
        user: body.user,
        status: body.status
    });

    category.save((err, CategoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }

        res.json({
            ok: true,
            category: CategoryDB
        });
    });
});

// Actualizo una categoria
app.put('/categories/:id', [verificaToken, verificaAdminRole], function (req, res) {
    let id = req.params.id;
    let body = _.pick( req.body, ['name', 'user', 'status']);

    Category.findByIdAndUpdate( id, body, { new: true, runValidators: true, context: 'query' }, (err, categoryDB) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          message: err
        });
      }

      res.json({
        ok: true,
        categoria_actualizada: categoryDB
      });
    });

  });


// Elimino una categoria (actualizar)
app.delete('/categories/:id', [verificaToken, verificaAdminRole], function (req, res) {

    let id_categoria = req.params.id;
    
    let changeState = {
      status: false
    };

    Category.findByIdAndUpdate(id_categoria, changeState, { new: true}, (err, categoryDeleted) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: err
        });
      }

      if (categoryDeleted === null) {
        return res.status(400).json({
          ok: false,
          error: {
            message: 'La categoria que intenta eliminar no existe en la BD'
          }
        });
      }

      res.json({
        ok: true,
        categoria_eliminada: categoryDeleted
      });

    });

    // Eliminado Físico en la BD
  //
  // User.findByIdAndRemove(id_usuario, (err, categoryDeleted) => {

  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       message: err
  //     });
  //   }

  //   if (categoryDeleted === null) {
  //     return res.status(400).json({
  //       ok: false,
  //       error: {
  //         message: 'La categoria que intenta eliminar no existe en la BD'
  //       }
  //     });
  //   }

  //   res.json({
  //     ok: true,
  //     categoria_eliminada: categoryDeleted
  //   });

  // });

});

module.exports = app;

