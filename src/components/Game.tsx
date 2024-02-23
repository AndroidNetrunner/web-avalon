import {
  selectDescription,
  selectGameId,
  selectPlayers,
  setDescription,
  setPlayers,
  setRoundFail,
  setRoundSuccess,
} from "@/redux/slices/gameSlice";
import { selectUserId } from "@/redux/slices/userSlice";
import { Card } from "antd";
import { Content } from "antd/es/layout/layout";
import { useDispatch, useSelector } from "react-redux";
import Turn from "./Turn";
import { useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase.config";
import { DocumentData } from "firebase/firestore";
import {
  setElection,
  setLeader,
  setMissionTeam,
  setStage,
  setTeam,
  setVote,
} from "@/redux/slices/roundSlice";
import Title from "antd/es/typography/Title";
import PlayersList from "./PlayersList";
import ScoreBoard from "./ScoreBoard";
import FinalResult from "./FinalResult";

const isSamePlayersWithFirebaseStore = (
  data: DocumentData,
  original: Player[]
) => {
  let convertedOriginal: { [userId: string]: Player } = {};
  original.forEach((player) => {
    convertedOriginal[player.userId] = { ...player, gameId: data.gameId };
  });
  if (data)
    return JSON.stringify(data.players) === JSON.stringify(convertedOriginal);
};

const getVisiblePlayers = (
  players: Player[],
  role: string,
  myUserId: string
) => {
  let visibleRoles: Role[] = [];
  if (role === "멀린") {
    visibleRoles = ["악의 하수인", "암살자", "모르가나", "오베론"];
  } else if (["악의 하수인", "암살자", "모르가나", "모드레드"].includes(role)) {
    visibleRoles = ["악의 하수인", "암살자", "모르가나", "모드레드"];
  } else if (role === "퍼시발") {
    visibleRoles = ["멀린", "모르가나"];
  }
  return players
    .filter(
      (player) =>
        player.userId !== myUserId && visibleRoles.includes(player.role)
    )
    .map((player) => player.username)
    .join(", ");
};

const getDescriptions = (players: Player[], role: string, myUserId: string) => {
  if (
    ["멀린", "암살자", "악의 하수인", "모드레드", "모르가나"].includes(role)
  ) {
    return (
      <>
        <p>당신의 눈에 보이는 악의 세력은...</p>
        <p>
          <span style={{ fontWeight: "bold" }}>
            {getVisiblePlayers(players, role, myUserId)}
          </span>
          입니다!
        </p>
      </>
    );
  } else if (role === "퍼시발") {
    return (
      <>
        <p>당신의 눈에 보이는 멀린 후보는...</p>
        <p>
          <span style={{ fontWeight: "bold" }}>
            {getVisiblePlayers(players, role, myUserId)}
          </span>
          입니다!
        </p>
      </>
    );
  } else if (role === "선의 세력") {
    return <p>멀린을 도와 미션을 성공시켜 승리하세요!</p>;
  } else if (role === "오베론") {
    return <p>당신과 다른 악의 하수인들은 서로를 모릅니다.</p>;
  }
};

export default function Game() {
  const myUserId = useSelector(selectUserId);
  const players = useSelector(selectPlayers);
  const gameId = useSelector(selectGameId);
  const gameRef = ref(database, "games/" + gameId);
  const description = useSelector(selectDescription);
  const myself = players.find((player) => {
    return player.userId === myUserId;
  });
  const isEvil = [
    "암살자",
    "악의 하수인",
    "모드레드",
    "모르가나",
    "오베론",
  ].includes(myself?.role as string);
  const dispatch = useDispatch();
  useEffect(() => {
    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (typeof data !== "object") return;
        if ("players" in data && !isSamePlayersWithFirebaseStore(data, players))
          dispatch(setPlayers(data.players));
        if ("leader" in data) dispatch(setLeader(data.leader));
        dispatch(setTeam(data.team || []));
        dispatch(setVote(data.vote || []));
        dispatch(setMissionTeam(data.missionTeam || {}));
        if ("election" in data) dispatch(setElection(data.election));
        if ("roundSuccess" in data)
          dispatch(setRoundSuccess(data.roundSuccess));
        if ("roundFail" in data) dispatch(setRoundFail(data.roundFail));
        if ("mission" in data) dispatch(setMissionTeam(data.mission));
        if ("stage" in data) dispatch(setStage(data.stage));
        if ("description" in data) dispatch(setDescription(data.description));
      }
    });
  }, [gameRef, dispatch, players]);

  useEffect(() => {
    localStorage.setItem("userId", myUserId);
    localStorage.setItem("gameId", gameId);
  }, [myUserId, gameId]);
  return (
    <Content>
      {description ? (
        <FinalResult description={description} />
      ) : (
        <>
          <ScoreBoard />
          <Turn />
          <Card style={{ marginTop: "1rem" }}>
            <Title level={4}>
              당신의 역할은{" "}
              <span style={{ color: isEvil ? "red" : "blue" }}>
                {myself?.role}
              </span>
              입니다.
            </Title>
            {getDescriptions(players, myself?.role as string, myUserId)}
          </Card>
          <PlayersList />
        </>
      )}
    </Content>
  );
}
