"use strict"

const wrap = require("co-express")
const moment = require("moment")

const Event = require("../models/mongoose/event")


const SubscribeService = require("../services/subscribe-service")

const EventService = require("../services/event-service")

module.exports = {


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
    const { time, period, clienId } = req.params

    let startDate, endDate


    switch (time) {
      case "hour":
        startDate = moment().hour(period, "hour").startOf("hour")
        endDate =  moment().hour(period, "hour").endOf("hour")
        break
      case "day":
        startDate = moment().day(period, "day").startOf("day").endOf("hour")
        endDate =  moment().day(period, "day").endOf("day").endOf("hour")
        break
      case "month":
        startDate = moment().month(period, "month").startOf("month").startOf("day")
        endDate =  moment().month(period, "month").endOf("month").endOf("day")
        break
    }

    const events = yield EventService.list(startDate.toDate(), endDate.toDate(), clienId)

    res.json({
      events: events.map(event => ({
        type: event.type,
        payload: event.payload,
        date: event.date,
        links: [
          { rel: "self", href: `/api/v1/events/${event.id}` },
          { rel: "mark-processed", href: `/api/v1/events/${event.id}/ok/${clienId}` }
        ]
      })),
      links: [
        { rel: "self", href: req.originalUrl },
        { rel: "prev", href: `/api/v1/events/feed/${time}/${period - 1}/client/${clienId}` }
      ]
    })
  }),

  markProcessd: wrap(function*(req, res) {

    const { eventId, clientId } = req.params
    const ok = yield EventService.markProcessed(eventId, clientId)

    res.json({ acknowledge: ok })
  })
}
