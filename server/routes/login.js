const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;

    if (!body.email) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'El email es obligatorio!'
            }
        });
    }

    if (!body.password) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'El password es obligatorio!'
            }
        });
    }

    User.findOne( { email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                errorUserDB: {
                    message: '(Usuario) o contraseña incorrectos!'
                }
            });
        }

        if ( !bcrypt.compareSync(body.password, userDB.password) ) {
            return res.status(400).json({
                ok: false,
                errorUserDB: {
                    message: 'Usuario o (contraseña) incorrectos!'
                }
            });
        }

        let token = jwt.sign({
            usuario: userDB,
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok: true,
            user: userDB,
            token
        });
    });

});







module.exports = app;