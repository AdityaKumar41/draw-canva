import fs from "fs";

interface ActiveRoom {
  roomId: string;
  expiry: number;
}

let activeRoom = new Map<string, ActiveRoom>();

function addActiveRoom(roomId: string, expiry: number) {
  activeRoom.set(roomId, { roomId, expiry });
}

function removeActiveRoom(roomId: string) {
  activeRoom.delete(roomId);
}

function removeExpiredRooms() {
  const currentTime = new Date().getTime();
  activeRoom.forEach((room, roomId) => {
    if (room.expiry < currentTime) {
      activeRoom.delete(roomId);
    }
  });
}

setInterval(removeExpiredRooms, 300000);

export { activeRoom, addActiveRoom, removeActiveRoom, removeExpiredRooms };
