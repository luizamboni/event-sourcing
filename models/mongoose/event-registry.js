"use strict"

const mongoose = require("../../initializers/mongoose")()
const uuidv4 = require('uuid/v4')

const { Schema } = mongoose

const SteamSchema = new Schema({
  _id: { type: String , default: uuidv4 },
  source: { type: String , required: true },
  exchange: String,
  routingKey: String,
  uri: String
})

const EventRegistrySchema = new Schema({
  _id: { type: String, default: uuidv4 },
  type:  { type: String, required: true, unique: true }, // TODO make this primary
  ttl: { type: String, required: true, default: "ephemeral" },
  date: { type: Date, default: Date.now },
  streams: { type: [ SteamSchema ]},
})


module.exports = mongoose.model("EventRegistry", EventRegistrySchema)
