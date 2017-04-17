'use strict';

let express = require('express'),
    _ = require("lodash"),
    rooms = require('./data/rooms.json'),
    messages = require('./data/messages.json'),
    uuid = require("node-uuid"),
    users = require('./data/users.json'),
    router = express.Router();

module.exports = router;

router.get('/rooms', function (req, res) {
    res.json(rooms);
});

router.route('/rooms/:roomId/messages')
    .get(function (req, res) {
        let roomId = req.params.roomId;
        let roomMessages = messages
            .filter(m => m.roomId === roomId)
            .map(m => {
                let user = _.find(users, u => u.id === m.userId);
                return {text: `${user.name}: ${m.text}`};
            });

        let room = _.find(rooms, r => r.id === roomId);
        if (!room) {
            res.sendStatus(404);
            return;
        }

        res.json({
            room: room,
            messages: roomMessages
        })
    })
    .post(function (req, res) {
        let roomId = req.params.roomId;

        let message = {
            roomId: roomId,
            text: req.body.text,
            userId: req.user.id,
            id: uuid.v4()
        };

        messages.push(message);

        res.sendStatus(200)

    })
    .delete(function (req, res) {
        let roomId = req.params.roomId;

        messages = messages.filter(m => m.roomId !== roomId);
        res.sendStatus(200)

    });
