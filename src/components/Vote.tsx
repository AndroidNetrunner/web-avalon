import { Button, Card } from "antd";
import { useVote } from "@/hooks/useVote";
import useVoteState from "@/hooks/useVoteState";
import React from "react";

function VoteButton({
  type,
  handleVote,
}: {
  type: "agree" | "disagree";
  handleVote: (type: "agree" | "disagree") => void;
}) {
  const buttonText = type === "agree" ? "찬성" : "반대";
  const danger = type !== "agree";

  return (
    <Button type="primary" onClick={() => handleVote(type)} danger={danger}>
      {buttonText}
    </Button>
  );
}

export default function Vote() {
  const { players, leader, round, team, election } = useVoteState();
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
        <VoteButton type="agree" handleVote={handleVote} />
        <VoteButton type="disagree" handleVote={handleVote} />
      </div>
    </>
  );
}
