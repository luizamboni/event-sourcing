"use strict"

const mongoose = require("../../initializers/mongoose")()

const { Schema } = mongoose

const EventRegistrySchema = new Schema({
  _id: { type: String },
  type:  { type: String, required: true }, // TODO make this primary
  ttl: { type: String, required: true, default: "ephemeral" },
  date: { type: Date, default: Date.now },
  streams: { type: [ Object ]},
})


module.exports = mongoose.model("EventRegistry", EventRegistrySchema)
