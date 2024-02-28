import { selectStage } from "@/redux/slices/roundSlice";
import { Steps } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const stageToCurrent = {
  nomination: 0,
  vote: 1,
  mission: 2,
};

export default function RoundStep() {
  const [current, setCurrent] = useState(0);
  const stage = useSelector(selectStage);
  const items = [
    { key: "지목 단계", title: "지목 단계" },
    { key: "투표 단계", title: "투표 단계" },
    { key: "임무 단계", title: "임무 단계" },
  ];

  useEffect(() => setCurrent(stageToCurrent[stage]), [stage]);

  return (
    <Steps
      style={{ marginBottom: "1rem" }}
      items={items}
      current={current}
    ></Steps>
  );
}
