import {
  selectPlayers,
  selectRoundFail,
  selectRoundSuccess,
} from "@/redux/slices/gameSlice";
import {
  selectElection,
  selectLeader,
  selectTeam,
} from "@/redux/slices/roundSlice";
import { useSelector } from "react-redux";

export default function useVoteState() {
  const players = useSelector(selectPlayers);
  const leaderId = useSelector(selectLeader);
  const leader = players.find((player) => player.userId === leaderId);
  if (!leader) throw new Error("Leader not found");
  const election = useSelector(selectElection);
  const roundSuccess = useSelector(selectRoundSuccess);
  const roundFail = useSelector(selectRoundFail);
  const round = roundSuccess + roundFail + 1;
  const team = useSelector(selectTeam);

  return { players, leader, round, team, election };
}
