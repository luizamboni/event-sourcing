"use strict"

const mongoose = require("../../initializers/mongoose")()
const uuidv4 = require('uuid/v4')

const { Schema } = mongoose


const EventRegistrySchema = new Schema({
  _id: { type: String, default: uuidv4 },
  event_name:  { type: String, required: true },
  date: { type: Date, default: Date.now },
  options: { type: Object, required: true },
})


module.exports = mongoose.model("EventRegistry", EventRegistrySchema, "events_registries")
