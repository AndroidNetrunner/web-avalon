import { useDispatch } from "react-redux";
import { Player } from "../interfaces/Player";
import { database } from "../../firebase.config";
import { ref, runTransaction } from "firebase/database";
import { RoomDataFromDatabase } from "../interfaces/Room";
import { setInvitationCode } from "@/redux/slices/roomSlice";
import { resetGame } from "@/redux/slices/gameSlice";

const useRejoin = () => {
  const dispatch = useDispatch();
  const handleRejoin = async (player: Player) => {
    const { gameId, userId, username } = player;
    const roomDocRef = ref(database, `rooms/${gameId}`);
    try {
      await runTransaction(roomDocRef, (currentData: RoomDataFromDatabase) => {
        if (!currentData) {
          return {
            participants: { [userId]: { userId, username } },
            invitationCode: gameId,
            ownerId: userId,
          };
        } else {
          const participants = currentData.participants;
          if (participants)
            participants[userId] = {
              userId,
              username,
            };
          return currentData;
        }
      });
      dispatch(setInvitationCode(gameId));
      dispatch(resetGame());
      localStorage.removeItem("gameId");
    } catch (error) {
      console.log("Transaction failed: ", error);
    }
  };
  return { handleRejoin };
};

export default useRejoin;
