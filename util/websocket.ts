class Websockets{
    users:any = [];

    connection = (client:any)=>{
         // event fired when the chat room is disconnected
    client.on("disconnect", () => {
        this.users = this.users.filter((user:any) => user.socketId !== client.id);
      });

     // add identity of user mapped to the socket id
      client.on("identity", (userId:String) => {
        this.users.push({
          socketId: client.id,
          userId: userId,
        });
      });

// subscribe person to chat & other user as well
client.on("subscribe", (room:any, otherUserId = "") => {
    this.subscribeOtherUser(room, otherUserId);
    client.join(room);
  });

  // mute a chat room
  client.on("unsubscribe", (room:any) => {
    client.leave(room);
  });

    }
    subscribeOtherUser = (room:any, otherUserId:String) => {
        const userSockets = this.users.filter(
          (user:any) => user.userId === otherUserId
        );
        userSockets.map((userInfo:any) => {
         
        });
      };

    
}
export default new Websockets();