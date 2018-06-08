const Event = require("../models/mongoose/event")
const rp = require("request-promise")
const moment = require("moment")

module.exports = {

  _serialize(event) {
    if (event.map)
      return event.map(e => this._serialize(e))
    else
      return {
        id: event.id,
        payload: event.payload,
        data: event.date,
        type: event.type,
      }
  },

  list(startDate, endDate, not_processed_by) {

    const q = {
      date: {
        $gte: startDate,
        $lt: endDate,
      }
    }

    if (not_processed_by)
      q.processed_by = {
        $nin: [not_processed_by]
      }

    return Event.find(q).then(events => this._serialize(events))
  },

  findOne(id) {
    return Event.findOne({ _id: id }).then(event => this._serialize(event))
  },

  markProcessed(eventId, clientId) {

    return Event.findOne({ _id: eventId, processed_by: { $nin: [ clientId ]  }})
    .then(event => {
      if (event) {
        event.processed_by.addToSet(clientId)
        event.save()
        return true
      }
    })
  },

  process(data, subscriptions) {
    for(const subscription of subscriptions) {
      const { options } = subscription
      const { type } = options

      switch(type) {
        case "rabbit" :
          console.log("rabbit", options, data)
        break
        
        case "webhook" :
          console.log("webhook", options, data)
          rp({ method: "POST", json: true, body: data, uri: options.uri })
        break

        case "mongo" :
          console.log("mongo", options, data)
          Event.create(data)
        break
      }
    }
  }
}