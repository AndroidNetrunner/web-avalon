import { resetGame } from "@/redux/slices/gameSlice";
import { resetUser } from "@/redux/slices/userSlice";
import { Button, Modal } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

export default function ResetButton() {
  const [openResetModal, setOpenResetModal] = useState(false);
  const dispatch = useDispatch();

  const handleOk = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    dispatch(resetGame());
    dispatch(resetUser());
    setOpenResetModal(false);
  };

  const handleCancel = () => {
    setOpenResetModal(false);
  };

  const handleReset = () => {
    setOpenResetModal(true);
  };
  return (
    <>
      <StyledButton onClick={handleReset} danger>
        강제 종료
      </StyledButton>
      <Modal open={openResetModal} onOk={handleOk} onCancel={handleCancel}>
        <p>정말로 강제 종료하시겠습니까?</p>
      </Modal>
    </>
  );
}

const StyledButton = styled(Button)`
  margin: 1rem;
`;
