module.exports = {
    name: "raw",
     async execute(client, packet) 
     {
        client.manager.packetUpdate(packet);
    }
  };