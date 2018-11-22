const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Favourites = require('../Models/favourite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favourites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourites);
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .then((favourites) => {
                if (favourites == null) {
                    var alldishes = req.body;
                    var favObj = {};
                    user = req.user._id;
                    for (var i = 0; i < alldishes.length; i++) {
                        favObj.dishIds[i] = alldishes[i]._id;
                    }
                    Favourites.create(favObj)
                        .then((fav) => {
                            console.log('Added to favourites ', fav);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(fav);
                        }, (err) => next(err))
                        .catch((err) => next(err))
                }
                else {
                    var alldishes = req.body;
                    for (var i = 0; i < alldishes.length; i++) {
                        if (favourites.dishes.indexOf(alldishes[i]._id) == -1)
                            favourites.dishes.push(alldishes[i]);
                    }
                    favourites.save()
                        .then((fav) => {
                            console.log('Added to favourites ', fav);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(fav);
                        }, (err) => next(err))
                        .catch((err) => next(err))
                }

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favourites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.remove()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err))
    });


favouriteRouter.route('/:favId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.favId);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .then((favourites) => {
                console.log("FAV : " + favourites);
                if (favourites == null) {
                    var favObj = {};
                    favObj.user = req.user._id;
                    favObj.dishes = req.params.favId;
                    Favourites.create(favObj)
                        .then((fav) => {
                            console.log('Added to favourites ', fav);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(fav);
                        }, (err) => next(err))
                        .catch((err) => next(err))
                }
                else {
                    favourites.dishes.push(req.params.favId);
                    favourites.save()
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(fav);
                        }, (err) => next(err));
                }


            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.favId);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favourites.findOne({ user: req.user._id })
            .then((fav) => {
                if (fav != null) {
                    var index = fav.dishes.indexOf(req.params.favId);
                    if (index > -1) {

                        fav.dishes.splice(index, 1);
                    }
                    fav.save()
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(fav);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Dish not Present');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    });

module.exports = favouriteRouter;        