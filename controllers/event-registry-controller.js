"use strict"

const wrap = require("co-express")
const _ = require("underscore")

const SubscribeService = require("../services/subscribe-service")

module.exports = {

  get: wrap(function*(req, res) {
    const { id } = req.params

    const eventRegistry = yield SubscribeService.findOne(id)

     res.json({ eventRegistry })
  }),

  create: wrap(function*(req, res) {
    const attrs = req.body
    
    const eventRegistry = yield SubscribeService.subscribe(attrs)

    res.json({ eventRegistry })
  }),

  destroy: wrap(function*(req, res) {
    const { id } = req.params

    const eventRegistry = yield SubscribeService.subscribe(id)
    res.json({ eventRegistry })
  }),

}

