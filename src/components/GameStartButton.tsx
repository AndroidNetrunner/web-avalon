import {
  selectInvitationCode,
  selectParticipants,
} from "@/redux/slices/roomSlice";
import { Alert, Button } from "antd";
import { ref, remove, set, update } from "firebase/database";
import { useSelector } from "react-redux";
import { database } from "../../firebase.config";
import { getAnalytics, logEvent } from "firebase/analytics";

const maxEvilSpecialRoles = {
  5: 1,
  6: 1,
  7: 2,
  8: 2,
  9: 3,
  10: 3,
};

export default function GameStartButton({
  specialRoles,
}: {
  specialRoles: string[];
}) {
  const participants = useSelector(selectParticipants);
  const invitationCode = useSelector(selectInvitationCode);
  const evilSpecialRoles = specialRoles.filter((role) => role !== "퍼시발");
  const goodSpecialRoles = specialRoles.filter((role) => role === "퍼시발");
  const canGameStart =
    participants.length >= 5 &&
    participants.length <= 10 &&
    evilSpecialRoles.length <=
      maxEvilSpecialRoles[participants.length as 5 | 6 | 7 | 8 | 9 | 10];

  const handleGameStart = () => {
    goodSpecialRoles.push("멀린");
    evilSpecialRoles.push("암살자");
    const numberOfParticipants = participants.length;
    const numberOfEvilPlayers =
      maxEvilSpecialRoles[numberOfParticipants as 5 | 6 | 7 | 8 | 9 | 10] +
      1 -
      evilSpecialRoles.length;
    const numberOfGoodPlayers =
      numberOfParticipants -
      numberOfEvilPlayers -
      evilSpecialRoles.length -
      goodSpecialRoles.length;
    const allRoles = [...goodSpecialRoles, ...evilSpecialRoles];
    for (let i = 0; i < numberOfEvilPlayers; i++) {
      allRoles.push("악의 하수인");
    }
    for (let i = 0; i < numberOfGoodPlayers; i++) {
      allRoles.push("선의 세력");
    }
    shuffle(allRoles);
    let players: {
      [key: string]: { userId: string; username: string; role: Role };
    } = {};
    participants.forEach((participant, index) => {
      players[participant.userId] = {
        ...participant,
        role: allRoles[index] as Role,
      };
    });
    const randomLeaderIndex = Math.floor(Math.random() * numberOfParticipants);
    const selectedLeaderId = Object.keys(players)[randomLeaderIndex];
    update(ref(database, "games/" + invitationCode), {
      "/players": players,
      "/leader": selectedLeaderId,
      "/roundSuccess": 0,
      "/roundFail": 0,
      "/team": {},
      "/election": 1,
      "/vote": {},
      "/stage": "nomination",
    });
    remove(ref(database, "rooms/" + invitationCode));
    const analytics = getAnalytics();
    logEvent(analytics, "gameStart", {
      gameId: invitationCode,
    });
  };

  const errorMessage = () => {
    if (participants.length < 5) {
      return "최소 5명이 있어야 게임을 시작할 수 있습니다.";
    }
    if (participants.length > 10) {
      return "최대 10명까지만 게임을 진행할 수 있습니다.";
    }
    if (
      evilSpecialRoles.length >
      maxEvilSpecialRoles[participants.length as 5 | 6 | 7 | 8 | 9 | 10]
    ) {
      return "악역의 수가 너무 많습니다.";
    }
  };
  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <Button disabled={!canGameStart} onClick={handleGameStart}>
          게임 시작
        </Button>
      </div>
      {!canGameStart && (
        <Alert
          message={errorMessage()}
          type="error"
          showIcon
          style={{ marginBottom: "1rem" }}
        />
      )}
    </>
  );
}

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
