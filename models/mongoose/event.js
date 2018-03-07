"use strict"

const envLoader = require("env-o-loader")
const mongoose = require("mongoose")
const Promise = require("bluebird")

let mongoURL = null
let options = {}
let loaded = false

const config = envLoader("../config/mongoose.yaml")


function checkReplicaSet(url) {
  if (url.indexOf("replicaSet=") !== 1)
    return true

  return /^mongodb:\/\/[^/]+,.+/.test(url)
}


module.exports = () => {
  if (!loaded) {
    mongoURL = config.url


    if (checkReplicaSet(mongoURL)) {
      options = {
        db: { native_parser: true },
        replset: {
          auto_reconnect: false,
          poolSize: 10,
          socketOptions: {
            keepAlive: 1000,
            connectTimeoutMS: 30000,
          }
        },
        server: {
          poolSize: 5,
          socketOptions: {
            keepAlive: 1000,
            connectTimeoutMS: 30000,
          }
        }
      }
    }

    mongoose.set("debug", config.debug)
    mongoose.Promise = Promise
    loaded = true
  }

  // Reconnect if the connection is lost
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(mongoURL, options)
    logger.info(`[MongoDB] URL:  ${mongoURL}`)
  }
  return mongoose
}