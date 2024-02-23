import { selectRoundFail, selectRoundSuccess } from "@/redux/slices/gameSlice";
import { Table } from "antd";
import { useSelector } from "react-redux";

const columns = [
  {
    title: <span style={{ fontSize: "1.2rem", color: "blue" }}>선의 세력</span>,
    dataIndex: "roundSuccess",
    key: "선의 세력",
    align: "center" as const,
    render: (text: string) => (
      <span style={{ fontSize: "2rem", color: "blue" }}>{text}</span>
    ),
  },
  {
    title: (
      <span style={{ fontSize: "1.2rem", color: "red" }}>악의 하수인</span>
    ),
    dataIndex: "roundFail",
    key: "악의 하수인",
    align: "center" as const,
    render: (text: string) => (
      <span style={{ fontSize: "2rem", color: "red" }}>{text}</span>
    ),
  },
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
