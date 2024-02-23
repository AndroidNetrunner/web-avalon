import { Checkbox } from "antd";

const options = ["퍼시발", "모드레드", "모르가나", "오베론"];

export default function Options({
  setSpecialRoles,
}: {
  setSpecialRoles: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const onChange = (checkedValues: string[]) => {
    setSpecialRoles(checkedValues);
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <Checkbox.Group options={options} onChange={onChange} />
    </div>
  );
}
