
"use strict"

const app = require("express")()
const moment = require("moment")

const mongoose = require("./initializers/mongoose")()

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  type:  { type: String, required: true },
  payload: { type: Object, required: true },
  date: { type: Date, default: Date.now },
  processed_by: { type: [ String ] },
  meta: {
    origin: String,
    referer:  String
  }
})

const Event = mongoose.model('Event', eventSchema)

// midlewares
const loggerMiddleware = require("morgan")
const bodyParserMiddleware = require("body-parser")

app.use(bodyParserMiddleware.json())

app.use(loggerMiddleware("dev"))



app.post("/api/events/send", (req, res) => {
  const attrs = req.body
  console.log(attrs)
  Event.create(attrs)
  .then(event => {
    res.status(201).json(event)
    
  }).catch(err => {
    res.status(400).json({ error: err.message})
    
  })
})

app.put("/api/events/register", (req, res) => {
  
  res.json({ acknowledge: true })
})

app.get("/api/events/feed/:time/:period/client/:clienId", (req, res) => {
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
      $lt: endDate.toDate()
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
})

app.put("/api/events/:eventId/ok/:clientId", (req, res) => {

  res.json({ acknowledge: true })
})

app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message})
})

app.listen(3000)

module.exports = app