import { resetGame, selectPlayers } from "@/redux/slices/gameSlice";
import { resetRoom } from "@/redux/slices/roomSlice";
import { selectLeader } from "@/redux/slices/roundSlice";
import { resetUser, selectUserId } from "@/redux/slices/userSlice";
import { Button, Table } from "antd";
import Title from "antd/es/typography/Title";
import { getAnalytics, logEvent } from "firebase/analytics";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const columns = [
  {
    title: "닉네임",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "역할",
    dataIndex: "role",
    key: "role",
    render: (role: string) => {
      if (["멀린", "퍼시발", "선의 세력"].includes(role))
        return (
          <span style={{ color: "blue", fontWeight: "bold" }}>{role}</span>
        );
      return <span style={{ color: "red", fontWeight: "bold" }}>{role}</span>;
    },
  },
];

function isGoodWin(description: string) {
  switch (description) {
    case "암살 성공으로 인한 악의 하수인 승리":
      return false;
    case "미션 3번 실패로 인한 악의 하수인 승리":
      return false;
    case "투표 5번 부결로 인한 악의 하수인 승리":
      return false;
    case "미션 3번 성공 및 암살 실패로 인한 선의 세력 승리":
      return true;
  }
}

export default function FinalResult({ description }: { description: string }) {
  const players = useSelector(selectPlayers);
  const goodWin = isGoodWin(description);
  const dispatch = useDispatch();
  const leader = useSelector(selectLeader);
  const myUserId = useSelector(selectUserId);
  const isLeader = leader === myUserId;
  useEffect(() => {
    const analytics = getAnalytics();
    if (isLeader) {
      logEvent(analytics, "gameEnd", {
        isGoodWin: goodWin,
      });
    }
  }, [goodWin, isLeader]);
  return (
    <>
      <Title level={4} style={{ color: goodWin ? "blue" : "red" }}>
        {goodWin ? "선의 세력 승리" : "악의 하수인 승리"}
      </Title>
      <Title level={5}>{description}</Title>
      <Table
        style={{ marginBottom: "1rem" }}
        columns={columns}
        pagination={false}
        dataSource={players}
      />
      <div style={{ display: "flex", justifyContent: "center", gap: "3rem" }}>
        <Button
          type="primary"
          onClick={() => {
            localStorage.removeItem("gameId");
            dispatch(resetGame());
          }}
        >
          한 번 더!
        </Button>
        <Button
          type="primary"
          onClick={() => {
            localStorage.removeItem("userId");
            dispatch(resetRoom());
            dispatch(resetUser());
          }}
          danger
        >
          처음으로
        </Button>
      </div>
    </>
  );
}
