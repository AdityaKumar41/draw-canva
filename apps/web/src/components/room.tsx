import { useParams } from "react-router-dom";
import DrawBoard from "./draw-board";

const RoomSession = () => {
  const { roomId } = useParams();
  console.log("roomId: ", roomId);
  return <DrawBoard roomId={roomId} />;
};

export default RoomSession;
