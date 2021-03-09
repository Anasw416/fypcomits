/**
 * socketEvents - Attaches the socket events to the server
 * @param {function} io - socket.io server
 * @returns {function} Returns io with event listeners attached
 */
const socketEvents = (io) => {
  io.on('connection', (socket) => {
    console.log(`A user has connected! SocketId: ${socket.id}`);

    socket.on('join', (groupId) => {
      socket.join(groupId);
    });

    socket.on('leave', (groupId) => {
      socket.leave(groupId);
    });

    socket.on('disconnect', () => {
      console.log(`SocketId: ${socket.id} has disconnected!`);
    });

    socket.on('newMessage', (newMessage) => {
      console.log("Emitting new message")
      socket.broadcast.to(newMessage.group_id).emit('addMessage', newMessage);
    });
  });
};

module.exports = socketEvents;
