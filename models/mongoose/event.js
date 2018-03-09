"use strict"

const mongoose = require("../../initializers/mongoose")()
const uuidv4 = require('uuid/v4')

const { Schema } = mongoose

const eventSchema = new Schema({
  _id: { type: String, default: uuidv4  },
  name: { type: String, required: true },
  payload: { type: Object, required: true },
  date: { type: Date, default: Date.now },
  processed_by: { type: [ String ] },
  meta: {
    origin: String,
    referer: String
  }
})

module.exports = mongoose.model("Event", eventSchema)

