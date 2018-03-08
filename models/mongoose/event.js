"use strict"

const mongoose = require("../../initializers/mongoose")()

const { Schema } = mongoose

const eventSchema = new Schema({
  _id: { type: String },
  type: { type: String, required: true },
  payload: { type: Object, required: true },
  date: { type: Date, default: Date.now },
  processed_by: { type: [ String ] },
  meta: {
    origin: String,
    referer: String
  }
})

module.exports = mongoose.model("Event", eventSchema)

