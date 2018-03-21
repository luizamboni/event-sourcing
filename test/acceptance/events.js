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

    let res, body

    const period = 12

    before(function*() {
      res = yield request(app).get(`/api/v1/events/feed/hour/${period}/client/xpto`)
      body = res.body
    })

    it("response status", () => {
      expect(res.status).to.be.equal(200)
    })


    describe("links", () => {

      it("links", () => {
        debugger
        expect(body.links).to.be.equals([
          {
            rel: "self",
            href: "/api/v1/events/feed/hour/12/client/xpto",
          },
          {
            rel: "prev",
            href: "/api/events/feed/hour/11/client/xpto",
          }
        ])
      })

      it("mark proccesed", function*() {
debugger
        // let res = yield request(app).get(`/api/v1/events/feed/hour/${period}/client/xpto`)
        
        expect(res.status).to.be.equal(200)
      })
    })
  })
})
