import { SPECIAL_ROLES } from "@/constants/roles";
import { Checkbox } from "antd";

interface OptionsProps {
  setSpecialRoles: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function RoleOptions({ setSpecialRoles }: OptionsProps) {
  const handleCheckboxChange = (checkedValues: string[]) => {
    setSpecialRoles(checkedValues);
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <Checkbox.Group options={SPECIAL_ROLES} onChange={handleCheckboxChange} />
    </div>
  );
}
