const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');
const Favorites = require('../models/favorites');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Favorites.find({ user: req.user.id })
            .populate('user', 'dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.create(req.body, function(err, favorite) {
            if (err) throw err;
            favorite.user = req.user.id;
            favorite.dishes.push(req.body);
            console.log('Dish Added To Favorties! ', favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.remove()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /favorites/' + req.params.dishId);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id }, function(err, favorite) {
            if (err) throw err;
            for (var key in req.body) {
                var dishIndex = favorite.dishes.indexOf(req.body[key]);
                console.log(dishIndex);

                if (dishIndex == -1) {
                    Favorites.dishes.pus(req.body);
                    console.log("Favorite Updated!");
                }
            }
            favorite.save(function(err, favorite) {
                if (err) throw err;
                console.log("Favorites Updated!");
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            });
        });
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id }, function(err, favorite) {
            if (err) throw err;
            var dishIndex = favorite.dishes.indexOf(req.params.dishObjectId);
            favorite.dishes.splice(dishIndex, 1);
            console.log("Favorite Deleted");
            favorite.save(function(err, favorite) {
                if (err) throw err;
                console.log("Favorites Updated!");
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(res);
            });
        });
    });

module.exports = favoriteRouter; // JavaScript Document
