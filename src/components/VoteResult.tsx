import { selectPlayers } from "@/redux/slices/gameSlice";
import { selectVote as openVote, setVote } from "@/redux/slices/resultSlice";
import { selectVote as selectAllVotes } from "@/redux/slices/roundSlice";
import { Button, Modal } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function VoteResult() {
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
  const dispatch = useDispatch();
  return (
    <Modal
      open={openVoteResultModal}
      title={
        <span style={{ color: isPassed ? "green" : "red", fontWeight: "bold" }}>
          {isPassed ? "투표가 가결되었습니다!" : "투표가 부결되었습니다."}
        </span>
      }
      footer={
        <Button type="primary" onClick={() => dispatch(setVote(false))}>
          확인
        </Button>
      }
    >
      <p>찬성: {agree.join(", ")}</p>
      <p>반대: {disagree.join(", ")}</p>
    </Modal>
  );
}
