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
    
    if(subscriptions.length > 0) {

      EventService.process(attrs, subscriptions)

      res.status(202).json({ msg: "accepted" })
      
    } else {
      res.status(422).json({ msg: "not found"})
    }
  }),

  list: wrap(function*(req, res) {
    const { time, period, clienId } = req.params

    let startDate, endDate, prevDate, nextDate


    switch(time) {
      case "hour":
        startDate = moment(period).startOf("hour")
        endDate =  moment(period).endOf("hour")
        prevDate = startDate.add(-1, "hour").format("YYYY-MM-DDTHH")
        break
      case "day":
        startDate = moment(period).startOf("day")
        endDate =  moment(period).endOf("day")
        prevDate = startDate.add(-1, "day").format("YYYY-MM-DD")
        break
      case "month":
        startDate = moment(period).startOf("month").startOf("day")
        endDate =  moment(period).endOf("month").endOf("day")
        prevDate = startDate.add(-1, "month").format("YYYY-MM")
        break
    }

    const events = yield EventService.list(startDate.toDate(), endDate.toDate())

    res.json({
      events: events.map(event => ({
        type: event.type,
        payload: event.payload,
        date: event.date,
        links: [
          { rel: "self", href: `/api/events/${event.id}` },
          { rel: "mark-processed", href: `/api/events/${event.id}/ok/${clienId}` }
        ]
      })),
      links: [
        { rel: "self", href: req.originalUrl },
        { rel: "prev", href: `/api/events/feed/${time}/${prevDate}/client/${clienId}` }
      ]
    })
  }),

  markProcessd: wrap(function*(req, res) {

    const { eventId, clientId } = req.params
    const ok = yield EventService.markProcessed(eventId, clientId)

    res.json({ acknowledge: ok })
  })
}
