import { Card } from "antd";
import ScoreBoard from "./ScoreBoard";
import Turn from "./Turn";
import Title from "antd/es/typography/Title";
import RoleDescription from "./RoleDescription";
import PlayersList from "./PlayersList";
import { Role } from "@/interfaces/Player";
import React from "react";

export default function GamePlay({
  isEvil,
  role,
}: {
  isEvil: boolean;
  role: Role;
}) {
  return (
    <>
      <ScoreBoard />
      <Turn />
      <Card style={{ marginTop: "1rem" }}>
        <Title level={4}>
          당신의 역할은{" "}
          <span style={{ color: isEvil ? "red" : "blue" }}>{role}</span>
          입니다.
        </Title>
        <RoleDescription role={role} />
      </Card>
      <PlayersList />
    </>
  );
}
