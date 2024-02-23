"use client";

import React from "react";
import { Form, Input, Button, Typography } from "antd";
import { useDispatch } from "react-redux";
import { database } from "../../firebase.config";
import { ref, set, get, push, update } from "firebase/database";
import { setUserId, setUserName } from "@/redux/slices/userSlice";
import {
  setOwnerId,
  setParticipants,
  setInvitationCode,
} from "@/redux/slices/roomSlice";

const generateNewInvitationCode = () => {
  const roomId = Math.floor(Math.random() * 1000000).toString();
  return roomId.padStart(6, "0");
};

const generateNewUserId = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let userId = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    userId += characters[randomIndex];
  }
  return userId;
};

const Entry = () => {
  const dispatch = useDispatch();
  const handleCreateRoom = () => {
    const invitationCode = generateNewInvitationCode();
    const userId = generateNewUserId();
    dispatch(setUserId(userId));
    dispatch(setUserName(usernameInput));
    dispatch(setOwnerId(userId));
    dispatch(setInvitationCode(invitationCode));
    dispatch(setParticipants([{ userId, username: usernameInput }]));
    set(ref(database, "rooms/" + invitationCode), {
      invitationCode,
      participants: { [userId]: { userId, username: usernameInput } },
      ownerId: userId,
    });
  };
  const handleJoinRoom = async () => {
    const snapshot = await get(ref(database, "rooms/" + invitationCodeInput));
    if (snapshot.exists()) {
      const userId = generateNewUserId();
      dispatch(setUserId(userId));
      dispatch(setUserName(usernameInput));
      dispatch(setInvitationCode(invitationCodeInput));
      dispatch(setOwnerId(snapshot.val().ownerId));
      await update(
        ref(
          database,
          "rooms/" + invitationCodeInput + "/participants/" + userId
        ),
        {
          userId,
          username: usernameInput,
        }
      );
    } else {
      alert("존재하지 않는 방입니다.");
    }
  };
  const [usernameInput, setUsernameInput] = React.useState("");
  const [invitationCodeInput, setInvitationCodeInput] = React.useState("");
  const { Title } = Typography;
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
            onChange={(event) => setUsernameInput(event.target.value)}
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
            onChange={(event) => setInvitationCodeInput(event.target.value)}
            maxLength={6}
          />
        </Form.Item>
        <Form.Item
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "0.5rem" }}
            disabled={!usernameInput || !!invitationCodeInput}
            onClick={handleCreateRoom}
          >
            방 생성
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: "0.5rem" }}
            disabled={!usernameInput || invitationCodeInput.length !== 6}
            onClick={handleJoinRoom}
          >
            방 참가
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Entry;
