
module.exports = {


  process(event, streams) {
    for(const stream of streams) {
      switch(stream.source) {
        case "rabbit" :
          console.log("rabbit", stream, event)  
        break
        
        case "webhook" :
          console.log("webhook", stream, event)  
        break
      }
    }
  }
}