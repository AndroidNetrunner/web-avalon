import { setBalanced } from "@/redux/slices/gameSlice";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Switch, Tooltip } from "antd";
import { set } from "firebase/database";
import { useDispatch } from "react-redux";

export default function BalancedOption() {
  const dispatch = useDispatch();
  const handleSwitchChange = (checked: boolean) => {
    dispatch(setBalanced(checked));
  };
  return (
    <div style={{ margin: "1rem 0" }}>
      <Switch onChange={handleSwitchChange} /> 밸런스 모드 활성화하기{" "}
      <Tooltip
        title={`5인과 7인일 때의 원정대 인원이 바뀝니다.\n
      5인: 3-2-3-2-3\n
      7인: 2-3-4-3-4
      `}
      >
        <QuestionCircleOutlined style={{ marginLeft: 8, cursor: "pointer" }} />
      </Tooltip>{" "}
    </div>
  );
}
