"use client";

import React from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import useEnterRoom from "@/hooks/useEnterRoom";
import styled from "styled-components";
import Link from "antd/es/typography/Link";

const INVITATION_CODE_LENGTH = 6;

const Entry = () => {
  const [username, setUsername] = React.useState("");
  const [invitationCode, setInvitationCode] = React.useState("");
  const { Title } = Typography;
  const {
    handleCreateRoom,
    handleJoinRoom,
    error,
    isErrorModalOpen,
    handleCloseErrorModal,
  } = useEnterRoom();

  const canCreateRoom = username && !invitationCode;
  const canJoinRoom = username && invitationCode.length === 6;

  return (
    <div>
      <Title level={3}>레지스탕스 아발론 온라인</Title>
      <Link
        href="https://velog.io/@kby9906/%EB%A0%88%EC%A7%80%EC%8A%A4%ED%83%95%EC%8A%A4-%EC%95%84%EB%B0%9C%EB%A1%A0-%EC%98%A8%EB%9D%BC%EC%9D%B8-%EC%84%A4%EB%AA%85%EC%84%9C"
        target="_blank"
      >
        사이트가 처음이신가요?
      </Link>
      <Form name="entry-form">
        <Form.Item
          label="닉네임"
          name="nickname"
          rules={[{ required: true, message: "닉네임은 필수 사항입니다." }]}
        >
          <Input
            placeholder="게임에 표시될 닉네임을 정해주세요."
            onChange={(event) => setUsername(event.target.value)}
          />
        </Form.Item>
        <Form.Item
          label={`초대 코드(숫자 ${INVITATION_CODE_LENGTH}자리)`}
          name="inviationCode"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input
            placeholder="친구에게 전달받은 초대 코드를 입력해주세요."
            onChange={(event) => {
              setInvitationCode(event.target.value);
              handleCloseErrorModal();
            }}
            maxLength={INVITATION_CODE_LENGTH}
          />
        </Form.Item>
        {isErrorModalOpen && (
          <Alert
            message={error}
            type="error"
            closable
            onClose={handleCloseErrorModal}
            style={{ marginBottom: "1rem" }}
            showIcon
          />
        )}
        <StyledFormItem>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "0.5rem" }}
            disabled={!canCreateRoom}
            onClick={() => handleCreateRoom(username)}
          >
            방 생성
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: "0.5rem" }}
            disabled={!canJoinRoom}
            onClick={() => handleJoinRoom(username, invitationCode)}
          >
            방 참가
          </Button>
        </StyledFormItem>
      </Form>
    </div>
  );
};

const StyledFormItem = styled(Form.Item)`
  display: flex;
  justify-content: center;
`;

export default Entry;
