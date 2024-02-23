import { useCallback } from "react";
import { runTransaction, ref, Database } from "firebase/database";
import { useSelector } from "react-redux";
import { selectGameId, selectPlayers } from "@/redux/slices/gameSlice";
import { selectUserId } from "@/redux/slices/userSlice";
import { database } from "../../firebase.config";

type userId = string;

interface VoteState {
  leader: userId; // 원정대장
  team: Record<userId, userId>; // 원정대 후보 멤버
  mission: Record<string, string | undefined>;
  agree: userId[]; // 원정대 동의한 사람들
  disagree: userId[]; // 원정대 반대한 사람들
  election: number; // 몇 번째 선출인지
  vote: { [userId: string]: string };
  stage: "nomination" | "vote" | "mission";
  description: string;
}

export const useVote = () => {
  const gameId = useSelector(selectGameId);
  const myUserId = useSelector(selectUserId);
  const players = useSelector(selectPlayers);
  const handleVote = useCallback(
    (decision: string) => {
      runTransaction(
        ref(database, "games/" + gameId),
        (game: VoteState | null) => {
          if (game) {
            game.vote[myUserId] = decision;
            if (Object.values(game.vote).every((v) => v !== "")) {
              let agreeCount = 0;
              let disagreeCount = 0;
              for (const v in game.vote) {
                if (game.vote[v] === "agree") agreeCount++;
                else disagreeCount++;
              }
              if (agreeCount > disagreeCount) {
                game.election = 1;
                game.stage = "mission";
                game.mission = Object.keys(game.team).reduce(
                  (obj: Record<string, string | undefined>, member) => {
                    // runTransaction은 반드시 "", undefined, null 중 하나의 값이면 등록이 실패하는가?
                    obj[member] = "none";
                    return obj;
                  },
                  {}
                );
              } else {
                if (game.election === 5) {
                  game.description = "투표 5번 부결로 인한 악의 하수인 승리";
                  return game;
                }
                const leaderIndex = players
                  .map((player) => player.userId)
                  .indexOf(game.leader);

                if (leaderIndex === -1) {
                  throw new Error("Leader not found in players array");
                }
                const newLeaderId =
                  players[(leaderIndex + 1) % players.length].userId;
                game.leader = newLeaderId;
                game.election = game.election + 1;
                game.stage = "nomination";
              }
              game.team = {};
            }
          }
          return game;
        }
      );
    },
    [gameId, myUserId, players]
  );

  return { handleVote };
};
