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

export default function Turn() {
  const myUserId = useSelector(selectUserId);
  const myRole = useSelector(selectPlayers).find(
    (player) => player.userId === myUserId
  )?.role;
  const leader = useSelector(selectLeader);
  const vote = useSelector(selectVote);
  const missionTeam = useSelector(selectMissionTeam);
  const dispatch = useDispatch();
  const isMyTurn = leader === myUserId;
  const stage = useSelector(selectStage);
  const roundSuccess = useSelector(selectRoundSuccess);
  const roundFail = useSelector(selectRoundFail);
  const description = useSelector(selectDescription);
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
      {stage === "nomination" &&
        isMyTurn &&
        roundSuccess < 3 &&
        roundFail < 3 && <Nomination />}
      {stage === "vote" &&
        !vote[myUserId] &&
        roundSuccess < 3 &&
        roundFail < 3 && <Vote />}
      {stage === "mission" &&
        Object.keys(missionTeam).includes(myUserId) &&
        missionTeam[myUserId] === "none" &&
        roundSuccess < 3 &&
        roundFail < 3 && <Mission />}
      {roundSuccess >= 3 && !description && myRole === "암살자" && (
        <Assassination />
      )}
      <VoteResult />
      <MissionResult />
    </>
  );
}
