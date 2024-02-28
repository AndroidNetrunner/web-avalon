import { Player, Role } from "@/interfaces/Player";
import { selectPlayers } from "@/redux/slices/gameSlice";
import { selectUserId } from "@/redux/slices/userSlice";
import { useSelector } from "react-redux";

const roleToVisibleRoles: Partial<Record<Role, Role[]>> = {
  멀린: ["악의 하수인", "암살자", "모르가나", "오베론"],
  "악의 하수인": ["악의 하수인", "암살자", "모르가나", "모드레드"],
  암살자: ["악의 하수인", "암살자", "모르가나", "모드레드"],
  모르가나: ["악의 하수인", "암살자", "모르가나", "모드레드"],
  모드레드: ["악의 하수인", "암살자", "모르가나", "모드레드"],
  퍼시발: ["멀린", "모르가나"],
};

const roleToDescription = {
  멀린: "당신의 눈에 보이는 악의 세력은...",
  "악의 하수인": "당신의 눈에 보이는 악의 세력은...",
  암살자: "당신의 눈에 보이는 악의 세력은...",
  모르가나: "당신의 눈에 보이는 악의 세력은...",
  모드레드: "당신의 눈에 보이는 악의 세력은...",
  퍼시발: "당신의 눈에 보이는 멀린 후보는...",
  "선의 세력": "멀린을 도와 미션을 성공시켜 승리하세요!",
  오베론: "당신과 다른 악의 하수인들은 서로를 모릅니다.",
};

const getVisiblePlayers = (players: Player[], role: Role, myUserId: string) => {
  const visibleRoles = roleToVisibleRoles[role] || [];
  return players
    .filter(
      (player) =>
        player.userId !== myUserId && visibleRoles.includes(player.role)
    )
    .map((player) => player.username)
    .join(", ");
};

const getDescriptions = (role: Role) => {
  return roleToDescription[role];
};

const RoleDescription = ({ role }: { role: Role }) => {
  const players = useSelector(selectPlayers);
  const myUserId = useSelector(selectUserId);
  const description = getDescriptions(role);

  if (!description) return null;

  return (
    <>
      <p>{description}</p>
      <p>
        <span style={{ fontWeight: "bold" }}>
          {getVisiblePlayers(players, role, myUserId)}
        </span>
        입니다!
      </p>
    </>
  );
};

export default RoleDescription;
