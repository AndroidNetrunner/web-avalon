import { QuestionCircleOutlined } from "@ant-design/icons";
import { Radio, Tooltip } from "antd";

export default function BalancedOption() {
  return (
    <div style={{ margin: "1rem 0" }}>
      <Radio>밸런스 모드 활성화</Radio>
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
