import { setInvitationCode, setOwnerId } from "@/redux/slices/roomSlice";
import { setUserId, setUserName } from "@/redux/slices/userSlice";
import { get, ref, set, update } from "firebase/database";
import { useDispatch } from "react-redux";
import { database } from "../../firebase.config";

const generateNewInvitationCode: () => string = () => {
  const roomId = Math.floor(Math.random() * 1000000).toString();
  return roomId.padStart(6, "0");
};

const generateNewUserId: () => string = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let userId = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    userId += characters[randomIndex];
  }
  return userId;
};

export default function useEnterRoom() {
  const dispatch = useDispatch();
  const updateState = ({
    userId,
    usernameInput,
    invitationCode,
    ownerId,
  }: {
    userId: string;
    usernameInput: string;
    invitationCode: string;
    ownerId?: string;
  }) => {
    dispatch(setUserId(userId));
    dispatch(setUserName(usernameInput));
    dispatch(setOwnerId(ownerId || userId));
    dispatch(setInvitationCode(invitationCode));
  };

  const handleCreateRoom = async (usernameInput: string) => {
    const invitationCode = generateNewInvitationCode();
    const userId = generateNewUserId();
    updateState({ userId, usernameInput, invitationCode });
    await set(ref(database, "rooms/" + invitationCode), {
      invitationCode,
      participants: { [userId]: { userId, username: usernameInput } },
      ownerId: userId,
    });
  };

  const handleJoinRoom = async (
    usernameInput: string,
    invitationCode: string
  ) => {
    const snapshot = await get(ref(database, "rooms/" + invitationCode));
    if (snapshot.exists()) {
      const userId = generateNewUserId();
      updateState({
        userId,
        usernameInput,
        invitationCode,
        ownerId: snapshot.val().ownerId,
      });
      await update(
        ref(database, "rooms/" + invitationCode + "/participants/" + userId),
        {
          userId,
          username: usernameInput,
        }
      );
    } else {
      alert("존재하지 않는 방입니다.");
    }
  };
  return { handleCreateRoom, handleJoinRoom };
}
