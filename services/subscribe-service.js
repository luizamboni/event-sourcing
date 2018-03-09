
const EventRegistry = require("../models/mongoose/event-registry")

module.exports = {
 
  find(id){
    return EventRegistry.findOne(id)
  },

  subscribe(attrs) {
    return EventRegistry.create(attrs)
  },

  unsubscribe(id) {
    return EventRegistry.deleteOne({ _id: id })
  },

  eventSubscriptions(type) {
    return EventRegistry.find({ type })
  },

  eventHaveSubscriptions(type) {
    return this.eventSubscriptions(type).then(subs =>
      (subs.length > 0)
    )
  }
}
