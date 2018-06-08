"use strict"

const wrap = require("co-express")
const moment = require("moment")

const Event = require("../models/mongoose/event")


const SubscribeService = require("../services/subscribe-service")

const EventService = require("../services/event-service")

module.exports = {

  get: wrap(function*(req, res) {
    let { id } = req.params
    const event = yield EventService.findOne(id)

    res.json({
      type: event.type,
      payload: event.payload,
      date: event.date,
      _embedded: {
        subscriptions: yield SubscribeService.eventSubscriptions(event.type)
      },
      _links: [
        { rel: "self", href: `/api/v1/events/${event.id}` },
        { 
          rel: "mark-processed", 
          href: `/api/v1/events/${event.id}/ok/{clienId}` ,
          templated: true
        }
      ]
    })
    
  }),

  create: wrap(function*(req, res) {
    const attrs = req.body
    
    const subscriptions = yield SubscribeService.eventSubscriptions(attrs.type)
    
    if (subscriptions.length > 0) {

      EventService.process(attrs, subscriptions)

      res.status(202).json({ msg: "accepted" })
      
    } else {
      res.status(422).json({ msg: "not found"})
    }
  }),

  list: wrap(function*(req, res) {
    let { endDate, startDate, clienId } = req.params

    const events = yield EventService.list(startDate, endDate, clienId)

    const prevDate = moment(startDate).subtract(1, "day").format("YYYY-MM-DD")

    res.json({
      events: events.map(event => ({
        type: event.type,
        payload: event.payload,
        date: event.date,
        _links: [
          { rel: "self", href: `/api/v1/events/${event.id}` },
          { rel: "mark-processed", href: `/api/v1/events/${event.id}/ok/${clienId}` }
        ]
      })),
      _links: [
        { rel: "self", href: req.originalUrl },
        { rel: "prev", href: `/api/v1/events/feed/${prevDate}/to/${startDate}/client/${clienId}` }
      ]
    })
  }),

  markProcessd: wrap(function*(req, res) {

    const { eventId, clientId } = req.params
    const ok = yield EventService.markProcessed(eventId, clientId)

    res.json({ acknowledge: ok })
  })
}
