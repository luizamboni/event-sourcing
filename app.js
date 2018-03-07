
"use strict"

const app = require("express")()
const moment = require("moment")

const mongoose = require("./initializers/mongoose")()

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  type:  { type: String, required: true },
  payload: { type: Object, required: true },
  date: { type: Date, default: Date.now },
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

  let startDate, endDate

  switch(time) {
    case "hour":

    case "day":
      startDate = moment(period).startOf("day")
      endDate =  moment(period).endOf("day")
    case "month":
  }

  Event.find({
    date: {
      $gte: startDate.toDate(),
      $lt: endDate.toDate()
    },
  }).then(events => {
    res.json({
      events,
      links: [
        { rel: "self" }
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