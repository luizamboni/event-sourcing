
"use strict"

const app = require("express")()


const EventRegistryController = require("./controllers/event-registry-controller")
const EventController = require("./controllers/event-controller")

// midlewares
const loggerMiddleware = require("morgan")
const bodyParserMiddleware = require("body-parser")

app.use(bodyParserMiddleware.json())

app.use(loggerMiddleware("dev"))

app.get("/api/events/listener/:id", EventRegistryController.get)
app.post("/api/events/listener", EventRegistryController.create)
app.post("/api/events/listener/:id/streams", EventRegistryController.attachStream)
app.delete("/api/events/listener/:id/streams/:streamId", EventRegistryController.removeStream)

app.post("/api/events/send", EventController.create)
app.get("/api/events/feed/:time/:period/client/:clienId", EventController.list)
app.put("/api/events/:eventId/ok/:clientId", EventController.markProcessd)

app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message})
})

module.exports = app