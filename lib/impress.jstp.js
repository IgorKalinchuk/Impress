'use strict';

// JSTP over Websocket for Impress Application Server

// JSTP over Websocket Application plugin initialization
//
impress.jstp.mixin = function(application) {

  application.jstp.connections = {};
  application.jstp.nextConnectionId = 1;

  // JSTP over Websocket initialization (to be called automatically by Impress core)
  //
  application.jstp.initialize = function(client) {
    client.jstp = client.res.websocket;

    if (client.jstp) {

      // Accept websocket JSTP connection
      //
      client.jstp.accept = function(namespaces) {
        client.jstp.isAccepted = true;
        client.jstp.nextMessageId = 0;
        client.jstp.callCollection = {};
        client.jstp.namespaces = namespaces;

        var connection = client.jstp.request.accept('', client.jstp.request.origin);
        client.jstp.connection = connection;

        // Send data to JSTP connection
        //
        client.jstp.send = function(data) {
          if (connection.connected) connection.send(JSON.stringify(data));
        };

        // Execute JSTP call
        //
        client.jstp.call = function(name, parameters, callback) {
          client.jstp.nextMessageId++;
          var data = {
            id: 'S' + client.jstp.nextMessageId,
            type: 'call',
            name: name,
            data: parameters
          };
          data.callback = callback;
          client.jstp.callCollection[data.id] = data;
          connection.send(JSON.stringify(data));
        };

        // Dispatch JSTP message
        //
        connection.on('message', function(message) {
          var dataName = message.type + 'Data',
              data = message[dataName];
          var packet = JSON.parse(data);

          if (packet.type === 'call') {
          } else if (packet.type === 'callback') {
          } else if (packet.type === 'event') {
            application.frontend.emit(packet.name, packet.data);
          }
        });

        // connection.on('close', function(reasonCode, description) {
        //   console.log(api.common.nowDateTime() + ' peer ' + connection.remoteAddress + ' disconnected.');
        // });

        application.jstp.connections[application.jstp.nextConnectionId++] = client;

        return connection;
      };

    } else client.error(400);

  };

  // Finalize websocket JSTP connection
  //
  application.jstp.finalize = function(client) {
    var jstp = client.jstp;
    if (jstp && !jstp.isAccepted) jstp.request.reject();
  };

  // Multicst JSTP event
  //
  application.jstp.sendGlobal = function(eventName, data) {
    var client, connections = application.jstp.connections;
    for (var connectionId in connections) {
      client = connections[connectionId];
      client.jstp.send({
        type: 'event',
        name: eventName,
        data: data
      });
    }
  };

};
