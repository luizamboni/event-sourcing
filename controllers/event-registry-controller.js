"use strict"

const wrap = require("co-express")
const _ = require("underscore")
const EventRegistry = require("../models/mongoose/event-registry")

module.exports = {

  get: wrap(function*(req, res) {
    const { id } = req.params
    const { body: attrs } = req
    const eventRegistry = yield EventRegistry.find({ _id: id})

     res.json({ eventRegistry })
  }),

  create: wrap(function*(req, res) {
    const attrs = req.body
    
    const eventRegistry = yield EventRegistry.create(attrs)

    res.json(eventRegistry)
  }),

  attachStream: wrap(function*(req, res) {
    const { id } = req.params
    // stream attributes
    const { body: attrs } = req
    const eventRegistry = yield EventRegistry.findOne({ _id: id})

    yield eventRegistry.streams.addToSet(attrs)
    yield eventRegistry.save()
    res.json({ eventRegistry })
  }),

  removeStream: wrap(function*(req, res) {
    const { id, streamId } = req.params
    const eventRegistry = yield EventRegistry.findOne({ _id: id})
    eventRegistry.streams.id(streamId).remove()
    yield eventRegistry.save()

    res.json({ eventRegistry })
  }),
}

