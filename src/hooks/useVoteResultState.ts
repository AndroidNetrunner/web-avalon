import { useSelector } from "react-redux";
import { selectPlayers } from "@/redux/slices/gameSlice";
import { selectVote as openVote } from "@/redux/slices/resultSlice";
import { selectVote as selectAllVotes } from "@/redux/slices/roundSlice";

export default function useVoteResultState() {
  const players = useSelector(selectPlayers);
  const allVotes = useSelector(selectAllVotes);
  const agree = players
    .filter((player) => allVotes[player.userId] === "agree")
    .map((player) => player.username);
  const disagree = players
    .filter((player) => allVotes[player.userId] === "disagree")
    .map((player) => player.username);
  const isPassed = agree.length > disagree.length;
  const openVoteResultModal = useSelector(openVote);

  return { agree, disagree, isPassed, openVoteResultModal };
}
