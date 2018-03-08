"use strict"

const wrap = require("co-express")

const EventRegistry = require("../models/mongoose/event-registry")

module.exports = {


  create: wrap(function*(req, res) {
    const attrs = req.body
    
    EventRegistry.create(attrs).then(reg => {
      res.json({ acknowledge: true })
    })
  }),
}

