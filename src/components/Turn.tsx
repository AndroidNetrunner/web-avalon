import { useDispatch, useSelector } from "react-redux";
import Nomination from "./Nomination";
import { selectUserId } from "@/redux/slices/userSlice";
import {
  selectLeader,
  selectMissionTeam,
  selectStage,
  selectTeam,
  selectVote,
} from "@/redux/slices/roundSlice";
import {
  selectDescription,
  selectPlayers,
  selectRoundFail,
  selectRoundSuccess,
} from "@/redux/slices/gameSlice";
import Vote from "./Vote";
import Mission from "./Mission";
import { useEffect } from "react";
import { setMission, setVote } from "@/redux/slices/resultSlice";
import VoteResult from "./VoteResult";
import MissionResult from "./MissionResult";
import RoundStep from "./RoundStep";
import Assassination from "./Assassination";
import { WinDescription } from "@/constants/winDescsriptions";
import { Role } from "@/interfaces/Player";
import React from "react";
import Card from "antd/es/card/Card";
import { Spin, Typography } from "antd";

const { Text } = Typography;

export default function Turn() {
  const myUserId = useSelector(selectUserId);
  const myRole = useSelector(selectPlayers).find(
    (player) => player.userId === myUserId
  )?.role;
  if (!myRole) throw new Error("역할을 배정받지 못했습니다.");
  const leader = useSelector(selectLeader);
  const vote = useSelector(selectVote);
  const missionTeam = useSelector(selectMissionTeam);
  const dispatch = useDispatch();
  const isMyTurn = leader === myUserId;
  const stage = useSelector(selectStage);
  const roundSuccess = useSelector(selectRoundSuccess);
  const roundFail = useSelector(selectRoundFail);
  const description: WinDescription | null = useSelector(selectDescription);
  useEffect(() => {
    if (
      (stage === "nomination" && Object.values(vote).length > 0) ||
      (stage === "mission" &&
        Object.values(missionTeam).every((v) => v === "none"))
    ) {
      dispatch(setVote(true));
    }
    if (
      stage === "nomination" &&
      !Object.values(vote).length &&
      Object.values(missionTeam).length > 0
    ) {
      dispatch(setMission(true));
    }
  }, [vote, missionTeam, stage, dispatch]);

  return (
    <>
      <RoundStep />
      {stage === "nomination" && (
        <NominationTurn {...{ isMyTurn, roundSuccess, roundFail }} />
      )}
      {stage === "vote" && (
        <VoteTurn {...{ myUserId, vote, roundSuccess, roundFail }} />
      )}
      {stage === "mission" && (
        <MissionTurn {...{ myUserId, missionTeam, roundSuccess, roundFail }} />
      )}
      {roundSuccess >= 3 && <AssassinationTurn {...{ description, myRole }} />}
      <VoteResult />
      <MissionResult />
    </>
  );
}

function NominationTurn({
  isMyTurn,
  roundSuccess,
  roundFail,
}: {
  isMyTurn: boolean;
  roundSuccess: number;
  roundFail: number;
}) {
  return isMyTurn && roundSuccess < 3 && roundFail < 3 ? <Nomination /> : null;
}

function VoteTurn({
  myUserId,
  vote,
  roundSuccess,
  roundFail,
}: {
  myUserId: string;
  vote: Record<string, string>;
  roundSuccess: number;
  roundFail: number;
}) {
  return !vote[myUserId] && roundSuccess < 3 && roundFail < 3 ? <Vote /> : null;
}

function MissionTurn({
  myUserId,
  missionTeam,
  roundSuccess,
  roundFail,
}: {
  myUserId: string;
  missionTeam: Record<string, string>;
  roundSuccess: number;
  roundFail: number;
}) {
  return Object.keys(missionTeam).includes(myUserId) &&
    missionTeam[myUserId] === "none" &&
    roundSuccess < 3 &&
    roundFail < 3 ? (
    <Mission />
  ) : null;
}

function AssassinationTurn({
  description,
  myRole,
}: {
  description: WinDescription | null;
  myRole: Role;
}) {
  return !description && myRole === "암살자" ? (
    <Assassination />
  ) : (
    <Text type={"danger"}>암살자가 암살 진행 중...</Text>
  );
}
