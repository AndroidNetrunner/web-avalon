import {
  selectInvitationCode,
  selectOwnerId,
  selectParticipants,
  setInvitationCode,
  setParticipants,
} from "@/redux/slices/roomSlice";
import { Table, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Options from "./Options";
import GameStartButton from "./GameStartButton";
import { database } from "../../firebase.config";
import {
  DatabaseReference,
  onDisconnect,
  onValue,
  ref,
} from "firebase/database";
import { DocumentData } from "firebase/firestore";
import { setGameId } from "@/redux/slices/gameSlice";
import { selectUserId } from "@/redux/slices/userSlice";

const isSamePlayersWithFirebaseStore = (
  data: DocumentData,
  original: Object[]
) => {
  if (data)
    return (
      JSON.stringify(convertObjectToParticipantsArray(data.participants)) ===
      JSON.stringify(original)
    );
};

const convertObjectToParticipantsArray = (object: {
  [userId: string]: {
    userId: string;
    username: string;
  };
}) => {
  return Object.keys(object).map((key) => {
    return { userId: key, username: object[key].username };
  });
};

const useRoomData = (
  roomRef: DatabaseReference,
  participants: Participant[],
  invitationCode: string
) => {
  const dispatch = useDispatch();
  useEffect(() => {
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (
          typeof data === "object" &&
          "participants" in data &&
          !isSamePlayersWithFirebaseStore(data, participants)
        )
          dispatch(
            setParticipants(convertObjectToParticipantsArray(data.participants))
          );
      } else {
        dispatch(setParticipants([]));
        dispatch(setGameId(invitationCode));
        dispatch(setInvitationCode(""));
      }
    });
  }, [participants, dispatch, roomRef, invitationCode]);
};

const columns = [{ title: "닉네임", dataIndex: "username", key: "username" }];

export default function Room() {
  const participants = useSelector(selectParticipants);
  const invitationCode = useSelector(selectInvitationCode);
  const roomRef = ref(database, "rooms/" + invitationCode);
  const myUserId = useSelector(selectUserId);
  useRoomData(roomRef, participants, invitationCode);
  useEffect(() => {
    const userRef = ref(
      database,
      "rooms/" + invitationCode + "/participants/" + myUserId
    );
    onDisconnect(userRef).remove();
  }, [invitationCode, myUserId]);

  const { Title } = Typography;
  const [specialRoles, setSpecialRoles] = useState<string[]>([]);
  const ownerId = useSelector(selectOwnerId);
  return (
    <>
      <Content>
        <Title>초대 코드: {invitationCode}</Title>
        {myUserId === ownerId && (
          <>
            <GameStartButton specialRoles={specialRoles} />
            <Options setSpecialRoles={setSpecialRoles} />
          </>
        )}
        <Table dataSource={participants} columns={columns} />
      </Content>
    </>
  );
}
