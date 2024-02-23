import {
  selectGameId,
  selectPlayers,
  selectRoundFail,
  selectRoundSuccess,
} from "@/redux/slices/gameSlice";
import {
  selectElection,
  selectLeader,
  selectTeam,
  selectVote,
} from "@/redux/slices/roundSlice";
import { Button, Card, Space } from "antd";
import { useSelector } from "react-redux";
import { useVote } from "@/hooks/useVote";

export default function Vote() {
  const players = useSelector(selectPlayers);
  const leaderId = useSelector(selectLeader);
  const leader = players.find((player) => player.userId === leaderId);
  if (!leader) throw new Error("Leader not found");
  const election = useSelector(selectElection);
  const roundSuccess = useSelector(selectRoundSuccess);
  const roundFail = useSelector(selectRoundFail);
  const round = roundSuccess + roundFail + 1;
  const team = useSelector(selectTeam);
  const { handleVote } = useVote();

  return (
    <>
      <Card
        style={{ marginBottom: "1rem" }}
        title={`${leader?.username}님의 원정대 구성이 완료되었습니다.`}
      >
        <p>
          {round}라운드 {election}번째 투표입니다.
        </p>
        <p>
          원정대 구성:{" "}
          {team
            .map((teammateId) => {
              return players.find((player) => player.userId === teammateId)
                ?.username;
            })
            .join(", ")}
        </p>
        <p>아래 버튼을 눌러 찬성, 반대표를 던져주세요.</p>
      </Card>
      <div style={{ display: "flex", justifyContent: "center", gap: "3rem" }}>
        <Button type="primary" onClick={() => handleVote("agree")}>
          찬성
        </Button>
        <Button type="primary" onClick={() => handleVote("disagree")} danger>
          반대
        </Button>
      </div>
    </>
  );
}
