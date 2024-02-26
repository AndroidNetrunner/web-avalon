"use client";

import React from "react";
import { Form, Input, Button, Typography } from "antd";
import useEnterRoom from "@/hooks/useEnterRoom";
import styled from "styled-components";

const Entry = () => {
  const [username, setUsername] = React.useState("");
  const [invitationCode, setInvitationCode] = React.useState("");
  const { Title } = Typography;
  const { handleCreateRoom, handleJoinRoom } = useEnterRoom();

  const canCreateRoom = username && !invitationCode;
  const canJoinRoom = username && invitationCode.length === 6;

  return (
    <div>
      <Title level={3}>레지스탕스 아발론 온라인</Title>
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
          label="초대 코드(숫자 6자리)"
          name="inviationCode"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input
            placeholder="친구에게 전달받은 초대 코드를 입력해주세요."
            onChange={(event) => setInvitationCode(event.target.value)}
            maxLength={6}
          />
        </Form.Item>
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
