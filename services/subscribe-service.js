
const EventRegistry = require("../models/mongoose/event-registry")

module.exports = {
 
  _serialize(registry) {
    if (registry.map)
      return registry.map(e => this._serialize(e))
    else
      return {
        id: registry.id,
        event_name: registry.event_name,
        options: registry.options,
        date: registry.date,
      }
  },

  find(id){
    return EventRegistry.findOne(id).then(reg => this._serialize(reg))
  },

  subscribe(attrs) {
    return EventRegistry.create(attrs)
  },

  unsubscribe(id) {
    return EventRegistry.deleteOne({ _id: id })
  },

  eventSubscriptions(type) {
    return EventRegistry.find({ type }).then(reg => this._serialize(reg))
  },

  eventHaveSubscriptions(type) {
    return this.eventSubscriptions(type).then(subs =>
      (subs.length > 0)
    )
  }
}
