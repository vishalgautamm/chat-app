'use strict';

let express = require('express'),
    uuid = require("node-uuid"),
    _ = require("lodash"),
    rooms = require("./data/rooms.json"),
    router = express.Router();

module.exports = router;

router.use(function (req, res, next) {
    if (req.user.admin) {
        next();
        return;
    }
    // If someone is not authenticated, redirect them to login page
    res.redirect('/login');
});

router.route('/rooms')
    .get(function (req, res) {
        res.render("rooms", {
            title: "Admin rooms",
            rooms: rooms
        });
    });

router.route('/rooms/add')
    .get(function (req, res) {
        res.render("add")
    })
    .post(function (req, res) {
        let room = {
            name: req.body.name,
            id: uuid.v4()
        };
        rooms.push(room);
        res.redirect(req.baseUrl + "/rooms");
    });

router.route('/rooms/edit/:id')
    .all(function (req, res, next) {
        let roomId = req.params.id;

        let room = _.find(rooms, r => r.id === roomId);
        if (!room) {
            res.sendStatus(404);
            return;
        }
        res.locals.room = room;
        next()
    })
    .get(function (req, res) {
        res.render("edit");
    })
    .post(function (req, res) {
        res.locals.room.name = req.body.name;
        res.redirect(req.baseUrl + "/rooms");
    });

router.route('/rooms/delete/:id')
    .get(function (req, res) {
        let roomId = req.params.id;
        rooms = rooms.filter(r => r.id !== roomId);
        res.redirect(req.baseUrl + "/rooms");
    });

