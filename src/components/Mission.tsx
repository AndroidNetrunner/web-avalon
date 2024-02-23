import { useMission } from "@/hooks/useMission";
import { selectPlayers } from "@/redux/slices/gameSlice";
import { selectMissionTeam } from "@/redux/slices/roundSlice";
import { selectUserId } from "@/redux/slices/userSlice";
import { Button, Card, Space } from "antd";
import React from "react";
import { useSelector } from "react-redux";

export default function Mission() {
  const players = useSelector(selectPlayers);
  const missionTeam = useSelector(selectMissionTeam);
  const { handleMission } = useMission();
  const userId = useSelector(selectUserId);
  const amEvil = [
    "암살자",
    "악의 하수인",
    "모드레드",
    "모르가나",
    "오베론",
  ].includes(players.find((player) => player.userId === userId)?.role as Role);

  return (
    <>
      <Card
        style={{ marginBottom: "1rem" }}
        title="이제 미션을 수행할 차례입니다!"
      >
        <p>
          원정대:{" "}
          {Object.keys(missionTeam)
            .map((teammateId) => {
              return players.find((player) => player.userId === teammateId)
                ?.username;
            })
            .join(", ")}
        </p>
        <p>아래 버튼을 눌러 미션 성공, 실패 중 하나를 선택해주세요.</p>
      </Card>
      <div style={{ display: "flex", justifyContent: "center", gap: "3rem" }}>
        <Button type="primary" onClick={() => handleMission("success")}>
          미션 성공
        </Button>
        <Button
          type="primary"
          onClick={() => handleMission("fail")}
          disabled={!amEvil}
          danger
        >
          미션 실패
        </Button>
      </div>
    </>
  );
}
