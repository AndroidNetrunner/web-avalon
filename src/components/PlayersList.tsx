import { Player } from "@/interfaces/Player";
import { selectPlayers } from "@/redux/slices/gameSlice";
import { selectLeader } from "@/redux/slices/roundSlice";
import { CrownOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { useSelector } from "react-redux";

function renderUsername(_: any, { userId, username }: Player, leader: string) {
  return userId === leader ? (
    <span style={{ fontWeight: "bold" }}>
      {username} <CrownOutlined style={{ color: "#FFD700" }} />
    </span>
  ) : (
    username
  );
}

function getColumns(leaderId: string) {
  return [
    {
      title: "닉네임",
      dataIndex: "username",
      key: "username",
      render: (_: any, player: Player) => renderUsername(_, player, leaderId),
    },
  ];
}

export default function PlayersList() {
  const players = useSelector(selectPlayers);
  const leaderId = useSelector(selectLeader);
  return (
    <Table
      style={{ marginTop: "3rem" }}
      dataSource={players}
      columns={getColumns(leaderId)}
      pagination={false}
    />
  );
}
