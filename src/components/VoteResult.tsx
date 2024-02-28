import useVoteResult from "@/hooks/useVoteResult";
import useVoteResultState from "@/hooks/useVoteResultState";
import { Button, Modal } from "antd";
import React from "react";

export default function VoteResult() {
  const { agree, disagree, isPassed, openVoteResultModal } =
    useVoteResultState();
  const { handleClose } = useVoteResult();
  return (
    <Modal
      open={openVoteResultModal}
      title={
        <span style={{ color: isPassed ? "green" : "red", fontWeight: "bold" }}>
          {isPassed ? "투표가 가결되었습니다!" : "투표가 부결되었습니다."}
        </span>
      }
      footer={
        <Button type="primary" onClick={handleClose}>
          확인
        </Button>
      }
    >
      <p>찬성: {agree.join(", ")}</p>
      <p>반대: {disagree.join(", ")}</p>
    </Modal>
  );
}
