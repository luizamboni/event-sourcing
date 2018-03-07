Event Source Api
===

**Objetivo:** 
Centralizar eventos em um sistema distribuido
abstraíndo as tecnologias relacionadas a mensageria e persistência


# API rest
`POST http://host.example.com/api/events/send`

<small>envia um evento, se o tipo dele estiver registrado, será dado o devido tratamento de acordo como ele estiver configurado</small>
```jasvascript
{
  type: "financial:end-budget",
  payload: {
    campaign_id: 123
  }
}
```
`PUT http://host.example.com/api/events/register`

<small>registra um tipo de evento para ser tratado (do contrário é descartado)</small>

```jasvascript
{
  type: "financial:end-budget",
  ttl: "24days" | "permanent" | "ephemeral"

  streams: [
    { 
      source: "rabbit",
      exchange: "campaigns",
      routingKey: "end-budget",
    },
    { 
      source: "webhook",
      uri: "http://example/api/v1/unpublish",
    },
  ]
}
->
<- 

```
`GET http://host.example.com/api/events/feed/hour/current/client/12345`

<small>consulta de feed de eventos por corte baseado em horas, dias, ou outra fatia de tempo determinada</small>

```jasvascript

<-
{ 
  events: [
    {
      id: "2465467567",
      type: "financial:end-budget",
      payload: {
        campaign_id: 123
      },
      created_at: "2018-02-01T11:12:01,
      links: [
        {
          rel: "mark-processed",
          href: "http://host.example.com/api/events/2465467567/ok/12345" 
        }
      ]
    },
    {
      id: "12345647879",
      type: "financial:end-budget",
      payload: {
        campaign_id: 111
      },
      created_at: "2018-02-01T10:12:01",
      links: [
        {
          rel: "mark-processed",
          href: "http://host.example.com/api/events/12345647879/ok/12345" 
        }
      ]
    },
    {
      id: "8764356356",
      type: "financial:end-budget",
      payload: {
        campaign_id: 145
      },
      created_at: "2018-02-01T08:12:01,
      links: [
        {
          rel: "mark-processed",
          href: "http://host.example.com/api/events/8764356356/ok/12345" 
        }
      ]
    },
  ],
  links: [
    {
      rel: "self",
      href: "http://host.example.com/api/events/feed/hour/2018-02-01T15:00:00.000Z",
    }
    ,
    {
      rel: "prev",
      href: "http://host.example.com/api/events/feed/hour/2018-02-01T14:00:00.000Z",
    }
  ]
}
```
`PUT http://host.example.com/api/events/8764356356/ok/12345`

<small>notifica que o evento já foi processado</small>

```javascript
<-
{ acknowledge: true }
```

# WEBSocket
`ws://host.example.com/api/events/?types=financial:end-budget,campaign:stop-campaign`

<small>para notificações em tempo real</small>

```javascrip
  "{ "type": "financial:end-budget", "payload": "campaign_id": 145 }}"
  ...
```