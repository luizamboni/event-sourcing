const app = require("../../app")
const { expect } = require("chai")
const request = require("supertest")
const moment = require("moment")
const Factory = require("mongodb-test-helper")
const envLoader = require("env-o-loader") 


const helper = Factory({
  url: envLoader("../../config/mongoose.yaml").url,
  collections: [
    "events", "events_registries"
  ]
 })


const SubscribeService = require("../../services/subscribe-service")

describe("events routes", () => {

  describe("POST /api/v1/events", () => {
    let res

    before(function*() {
      yield helper.clearDB()
      yield SubscribeService.subscribe({
        event_name: "campaign:end-budget",
        options: {
          type: "rabbit",
          routingKey: "ads",
          exchange: "publish"
        }
      })

      yield SubscribeService.subscribe({
        event_name: "campaign:end-budget",
        options: {
          type: "mongo"
        }
      })
      
      yield SubscribeService.subscribe({
        event_name: "campaign:end-budget",
        options: {
          type: "webhook",
          uri: "http://localhost:3000/webhook"
        }
      })

      res = yield request(app).post("/api/v1/events").send({
        name: "campaign:end-budget",
        payload: {
          account: 123
        }
      })
    })

    it("response status should be 202", () => {
      expect(res.status).to.be.equal(202)
    })

    it("response body", () => {
      expect(res.body).to.be.eqls({ msg: "accepted" })
    })

  })

  describe("GET /api/v1/events/feed/:time/:period/client/:clientId", () => {

    let res

    const period = moment().startOf("day").format("YYYY-DD-MMTHH")

    before(function*() {
      res = yield request(app).get(`/api/v1/events/feed/hour/${period}/client/xpto`)
    })

    it("response status", () => {
      expect(res.status).to.be.equal(200)
    })
  })

})