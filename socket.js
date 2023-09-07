// const socketIO = require('socket.io');

// module.exports = (server) => {
//   const io = socketIO(server);

//   io.on('connection', (socket) => {
//     console.log('Socket connected:', socket.id);

//     // Handle audio data transmission
//     socket.on('audioData', (data) => {
//       // Broadcast the received audio data to all other connected sockets
//       socket.broadcast.emit('audioData', data);
//     });

//     socket.on('disconnect', () => {
//       console.log('Socket disconnected:', socket.id);
//     });
//   });
//   return io;
// };
