import { setInvitationCode, setOwnerId } from "@/redux/slices/roomSlice";
import { setUserId, setUserName } from "@/redux/slices/userSlice";
import { get, ref, set, update } from "firebase/database";
import { useDispatch } from "react-redux";
import { database } from "../../firebase.config";
import { useState } from "react";

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

const checkRoomExists = async (invitationCode: string) => {
  const snapshot = await get(ref(database, "rooms/" + invitationCode));
  if (!snapshot.exists()) {
    throw new Error("존재하지 않는 방입니다.");
  }
  return snapshot;
};

const createRoomInDatabase = async (
  invitationCode: string,
  userId: string,
  usernameInput: string
) => {
  await set(ref(database, "rooms/" + invitationCode), {
    invitationCode,
    participants: { [userId]: { userId, username: usernameInput } },
    ownerId: userId,
  });
};

const addUserToRoomInDatabase = async (
  invitationCode: string,
  userId: string,
  usernameInput: string
) => {
  await update(
    ref(database, "rooms/" + invitationCode + "/participants/" + userId),
    {
      userId,
      username: usernameInput,
    }
  );
};

export default function useEnterRoom() {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const updateUserAndRoomState = ({
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
    updateUserAndRoomState({ userId, usernameInput, invitationCode });
    await createRoomInDatabase(invitationCode, userId, usernameInput);
  };

  const handleJoinRoom = async (
    usernameInput: string,
    invitationCode: string
  ) => {
    try {
      const snapshot = await checkRoomExists(invitationCode);
      const userId = generateNewUserId();
      updateUserAndRoomState({
        userId,
        usernameInput,
        invitationCode,
        ownerId: snapshot.val().ownerId,
      });
      addUserToRoomInDatabase(invitationCode, userId, usernameInput);
    } catch (err) {
      setError("존재하지 않는 방입니다. 초대 코드를 확인해주세요.");
      setIsErrorVisible(true);
    }
  };

  const handleCloseErrorModal = () => {
    setIsErrorVisible(false);
  };
  return {
    handleCreateRoom,
    handleJoinRoom,
    error,
    isErrorModalOpen: isErrorVisible,
    handleCloseErrorModal,
  };
}
