import { selectGameId, selectPlayers } from "@/redux/slices/gameSlice";
import { selectUserId } from "@/redux/slices/userSlice";
import { ref, runTransaction } from "firebase/database";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { database } from "../../firebase.config";

type userId = string;

interface MissionState {
  leader: userId; // 원정대장
  team: Record<userId, userId>; // 원정대 후보 멤버
  mission: Record<string, string | null>;
  roundSuccess: number; // 미션 성공 라운드 수
  roundFail: number; // 미션 실패 라운드 수
  vote: { [userId: string]: string };
  stage: "nomination" | "vote" | "mission";
  description: string;
}

export const useMission = () => {
  const gameId = useSelector(selectGameId);
  const players = useSelector(selectPlayers);
  const myUserId = useSelector(selectUserId);
  const handleMission = useCallback(
    (decision: string) => {
      runTransaction(
        ref(database, "games/" + gameId),
        (game: MissionState | null) => {
          if (game) {
            const roundNumber = game.roundFail + game.roundSuccess + 1;
            game.mission[myUserId] = decision;
            if (Object.values(game.mission).every((v) => v !== "none")) {
              let missionFail = 0;
              for (const v in game.mission) {
                if (game.mission[v] === "fail") {
                  missionFail++;
                }
              }
              if (
                (roundNumber !== 4 && missionFail > 0) ||
                (players.length >= 7 && roundNumber === 4 && missionFail > 1)
              ) {
                game.roundFail += 1;
              } else {
                game.roundSuccess += 1;
              }
              if (game.roundFail === 3)
                game.description = "미션 3번 실패로 인한 악의 하수인 승리";
              game.vote = {};
              game.stage = "nomination";
              const leaderIndex = players
                .map((player) => player.userId)
                .indexOf(game.leader);

              if (leaderIndex === -1) {
                throw new Error("Leader not found in players array");
              }
              const newLeaderId =
                players[(leaderIndex + 1) % players.length].userId;
              game.leader = newLeaderId;
            }
          }

          return game;
        }
      );
    },
    [gameId, myUserId, players]
  );

  return { handleMission };
};
