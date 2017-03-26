/**
 * WebSocket connection to display some server pushed messages.
 */
var webSockets = {  
  webSocketServerUri : "ws://" + window.location.host,
  connectionStatus : "NOT_CONNECTED",

  /**
   *  Create connection to server and bind handlers to events. 
   */
  init : function(){
        websocket = new WebSocket(this.webSocketServerUri);
        self = this;

        websocket.onopen = function(evt) { self.onOpen(evt)}
        websocket.onclose = function(evt) { self.onClose(evt) };
        websocket.onmessage = function(evt) { self.onMessage(evt) };
        websocket.onerror = function(evt) { self.onError(evt) };
  },
  /**
   * Event handlers
   */
  onOpen : function(evt){
      this.connectionStatus = "CONNECTED";
  },
  onClose : function(evt){
      this.connectionStatus = "CLOSED";
  },
  onMessage: function(evt){
      showMessage(evt.data);
  },
  onError : function(evt){
      console.log(evt);
  }
}


$(function(){
    webSockets.init();
});