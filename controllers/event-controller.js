"use strict"

const wrap = require("co-express")
const moment = require("moment")

const Event = require("../models/mongoose/event")

module.exports = {


  create: wrap(function*(req, res) {
    const attrs = req.body

    Event.create(attrs)
    .then(event => {
      res.status(201).json(event)
    }).catch(err => {
      res.status(400).json({ error: err.message})
    })
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

    Event.find({
      date: {
        $gte: startDate.toDate(),
        $lt: endDate.toDate(),
      },
    }).then(events => {
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
    })
  }),

  markProcessd: wrap(function*(req, res) {

    const { eventId, clientId } = req.params

    Event.findOne({ _id: eventId, processed_by: { $nin: [clientId]  }})
    .then(event => {
      if (event) {
        event.processed_by.addToSet(clientId)
        event.save()
        res.json({ acknowledge: true })
      } else // TODO: gone status
        res.json({ message: "event gone"})
    })
  })
}
