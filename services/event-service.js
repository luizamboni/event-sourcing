const Event = require("../models/mongoose/event")
const rp = require("request-promise")
const moment = require("moment")

module.exports = {


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

    return Event.find(q)
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