var WebSocket = require('ws');

var wss;

var init = function(server){
  console.log(server);
  wss = server;
  wss.on('connection', function(ws){
    console.log('connection inc');
  })
}



webSocketMessenger = {
   send : function(client, data){
     client.send(data);
   },
   /**
    * function to send data to all connected users
    * @param data [string] -  data to send 
    */ 
   broadcast : function(data){
     console.log(wss.clients);
      wss.clients.forEach(function(client){
        if(client.readyState === WebSocket.OPEN){
            client.send(data);
        }
      });
   } 
}

module.exports.wsm = webSocketMessenger;
module.exports.init = init;