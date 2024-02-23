import { selectPlayers } from "@/redux/slices/gameSlice";
import { selectLeader } from "@/redux/slices/roundSlice";
import { Table } from "antd";
import { useSelector } from "react-redux";

export default function PlayersList() {
  const players = useSelector(selectPlayers);
  const leader = useSelector(selectLeader);
  const columns = [
    {
      title: "닉네임",
      dataIndex: "username",
      key: "username",
      render: (
        _: any,
        { userId, username }: { userId: string; username: string }
      ) =>
        userId === leader ? (
          <span style={{ color: "#7A6397", fontWeight: "bold" }}>
            {username}
          </span>
        ) : (
          username
        ),
    },
  ];
  return (
    <Table
      style={{ marginTop: "3rem" }}
      dataSource={players}
      columns={columns}
      pagination={false}
    />
  );
}
