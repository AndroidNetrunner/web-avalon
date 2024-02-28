import { selectRoundFail, selectRoundSuccess } from "@/redux/slices/gameSlice";
import { Table } from "antd";
import { useSelector } from "react-redux";

const createColumn = (
  title: string,
  dataIndex: string,
  color: "blue" | "red"
) => {
  return {
    title: <span style={{ fontSize: "1.2rem", color }}>{title}</span>,
    dataIndex,
    key: title,
    align: "center" as const,
    render: (text: string) => (
      <span style={{ fontSize: "2rem", color }}>{text}</span>
    ),
  };
};

const columns = [
  createColumn("선의 세력", "roundSuccess", "blue"),
  createColumn("악의 하수인", "roundFail", "red"),
];

const ScoreBoard = () => {
  const roundSuccess = useSelector(selectRoundSuccess);
  const roundFail = useSelector(selectRoundFail);
  const score = [
    {
      roundSuccess,
      roundFail,
    },
  ];
  return (
    <Table
      style={{ marginBottom: "1rem" }}
      columns={columns}
      dataSource={score}
      pagination={false}
    ></Table>
  );
};

export default ScoreBoard;
