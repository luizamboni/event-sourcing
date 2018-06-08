
"use strict"

const app = require("express")()


const EventRegistryController = require("./controllers/event-registry-controller")
const EventController = require("./controllers/event-controller")

// midlewares
const loggerMiddleware = require("morgan")
const bodyParserMiddleware = require("body-parser")

app.use(bodyParserMiddleware.json())

app.use(loggerMiddleware("dev"))

app.get("/api/v1/listener/:id", EventRegistryController.get)
app.post("/api/v1/listener", EventRegistryController.create)
app.delete("/api/v1/listener/:id", EventRegistryController.destroy)

app.post("/api/v1/events/", EventController.create)
app.get("/api/v1/events/:id", EventController.get)
app.get("/api/v1/events/feed/:startDate/to/:endDate/client/:clienId", EventController.list)
app.put("/api/v1/events/:eventId/ok/:clientId", EventController.markProcessd)

app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message})
})

module.exports = app