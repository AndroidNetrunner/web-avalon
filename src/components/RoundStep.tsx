import {
  selectMissionTeam,
  selectStage,
  selectTeam,
  selectVote,
} from "@/redux/slices/roundSlice";
import { Steps } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const items = [
  { key: "지목 단계", title: "지목 단계" },
  { key: "투표 단계", title: "투표 단계" },
  { key: "임무 단계", title: "임무 단계" },
];

export default function RoundStep() {
  const [current, setCurrent] = useState(1);
  const stage = useSelector(selectStage);
  useEffect(() => {
    switch (stage) {
      case "nomination":
        setCurrent(0);
        break;
      case "vote":
        setCurrent(1);
        break;
      case "mission":
        setCurrent(2);
        break;
    }
  }, [stage]);

  return (
    <Steps
      style={{ marginBottom: "1rem" }}
      items={items}
      current={current}
    ></Steps>
  );
}
