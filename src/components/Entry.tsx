"use client";

import React from "react";
import { Form, Input, Button, Typography, Alert, Modal } from "antd";
import useEnterRoom from "@/hooks/useEnterRoom";
import styled from "styled-components";
import Link from "antd/es/typography/Link";
import AdSense from "./AdSense";
import { ReadOutlined } from "@ant-design/icons";

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

  const [isRuleModalOpen, setIsRuleModalOpen] = React.useState(false);

  const canCreateRoom = username && !invitationCode;
  const canJoinRoom = username && invitationCode.length === 6;

  return (
    <div style={{ position: "relative" }}>
      <ReadOutlined
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          fontSize: "24px",
          color: "#1890ff",
          cursor: "pointer",
        }}
        onClick={() => setIsRuleModalOpen(true)}
      />
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
        <AdSense
          pId="1473493437844810"
          slot="5369495644"
          style={{ display: "block", marginTop: "20px" }}
          format="auto"
          responsive="true"
        />
      </Form>
      <Modal
        title="레지스탕스 아발론 게임 규칙"
        open={isRuleModalOpen}
        onOk={() => setIsRuleModalOpen(false)}
        onCancel={() => setIsRuleModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsRuleModalOpen(false)}>
            닫기
          </Button>,
        ]}
      >
        <Typography>
          <Typography.Paragraph>
            <strong>게임 개요</strong>
            <br />
            레지스탕스 아발론은 선(아서 왕의 충신)과 악(모드레드의 수하)의
            대결을 다룬 추리 게임입니다. 플레이어들은 자신의 정체를 숨기거나
            드러내며 미션을 성공시키거나 실패시켜야 합니다.
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>승리 조건</strong>
            <br />
            - <strong>선(파란 팀):</strong> 5번의 미션 중 3번을 성공시키고, 암살자에게 멀린이 암살당하지 않아야 합니다.
            <br />
            - <strong>악(빨간 팀):</strong> 5번의 미션 중 3번을 실패시키거나, 미션이 3번 성공하더라도 멀린을 찾아내어 암살하면 승리합니다.
          </Typography.Paragraph>
          <Typography.Paragraph>
            <strong>게임 진행</strong>
            <br />
            1. <strong>원정대 구성:</strong> 리더는 미션을 수행할 원정대를 지목합니다.
            <br />
            2. <strong>투표:</strong> 모든 플레이어는 제안된 원정대에 찬성 또는 반대 투표를 합니다. 과반수가 찬성하면 미션이 진행됩니다.
            <br />
            3. <strong>미션 수행:</strong> 원정대로 뽑힌 플레이어는 &apos;성공&apos; 또는 &apos;실패&apos; 카드를 냅니다. (선은 무조건 성공만 낼 수 있습니다.)
            <br />
            4. <strong>결과 확인:</strong> 제출된 카드 중 &apos;실패&apos;가 하나라도 있으면 미션은 실패합니다. (특정 라운드 제외)
          </Typography.Paragraph>
          <Typography.Paragraph>
            친구들과 함께 심리전을 즐겨보세요!
          </Typography.Paragraph>
        </Typography>
      </Modal>
    </div>
  );
};

const StyledFormItem = styled(Form.Item)`
  display: flex;
  justify-content: center;
`;

export default Entry;
