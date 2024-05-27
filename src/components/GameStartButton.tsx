import {
  selectInvitationCode,
  selectParticipants,
} from "@/redux/slices/roomSlice";
import { Alert, Button } from "antd";
import { ref, remove, set, update } from "firebase/database";
import { useSelector } from "react-redux";
import { database } from "../../firebase.config";
import { getAnalytics, logEvent } from "firebase/analytics";
import { Player, Role } from "@/interfaces/Player";
import { selectBalanced } from "@/redux/slices/gameSlice";

const MAX_EVIL_SPECIAL_ROLES = {
  5: 1,
  6: 1,
  7: 2,
  8: 2,
  9: 3,
  10: 3,
};

const MIN_PARTICIPANTS = 5;
const MAX_PARTICIPANTS = 10;

export default function GameStartButton({
  specialRoles,
}: {
  specialRoles: string[];
}) {
  const participants = useSelector(selectParticipants);
  const invitationCode = useSelector(selectInvitationCode);
  const balanced = useSelector(selectBalanced);
  const evilSpecialRoles = specialRoles.filter((role) => role !== "퍼시발");
  const goodSpecialRoles = specialRoles.filter((role) => role === "퍼시발");
  const canGameStart =
    participants.length >= MIN_PARTICIPANTS &&
    participants.length <= MAX_PARTICIPANTS &&
    evilSpecialRoles.length <=
      MAX_EVIL_SPECIAL_ROLES[participants.length as 5 | 6 | 7 | 8 | 9 | 10];

  const handleGameStart = async () => {
    const roles = prepareRoles();
    shuffle(roles);
    const players = makePlayers(roles);
    const leader = chooseLeader();
    updateGame(players, leader.userId, balanced);
    await remove(ref(database, "rooms/" + invitationCode));
    logGameStart();
  };

  const prepareRoles: () => Role[] = () => {
    goodSpecialRoles.push("멀린");
    evilSpecialRoles.push("암살자");
    const numberOfParticipants = participants.length;
    const numberOfEvilPlayers =
      MAX_EVIL_SPECIAL_ROLES[numberOfParticipants as 5 | 6 | 7 | 8 | 9 | 10] +
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
    return allRoles as Role[];
  };

  const makePlayers = (roles: Role[]) => {
    let players: {
      [key: string]: { userId: string; username: string; role: Role };
    } = {};
    participants.forEach((participant, index) => {
      players[participant.userId] = {
        ...participant,
        role: roles[index],
      };
    });
    return players;
  };

  const chooseLeader = () => {
    const randomIndex = Math.floor(Math.random() * participants.length);
    const leader = participants[randomIndex];
    return leader;
  };

  const updateGame = (players: Object, leader: string, balanced: boolean) => {
    set(ref(database, "games/" + invitationCode), {
      players: players,
      leader: leader,
      roundSuccess: 0,
      roundFail: 0,
      team: {},
      election: 1,
      vote: {},
      stage: "nomination",
      balanced: balanced,
    });
  };

  const logGameStart = () => {
    const analytics = getAnalytics();
    logEvent(analytics, "gameStart", {
      gameId: invitationCode,
    });
  };

  const getErrorMessage = () => {
    if (participants.length < 5) {
      return "최소 5명이 있어야 게임을 시작할 수 있습니다.";
    }
    if (participants.length > 10) {
      return "최대 10명까지만 게임을 진행할 수 있습니다.";
    }
    if (
      evilSpecialRoles.length >
      MAX_EVIL_SPECIAL_ROLES[participants.length as 5 | 6 | 7 | 8 | 9 | 10]
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
          message={getErrorMessage()}
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
