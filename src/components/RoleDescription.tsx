import { Player, Role } from "@/interfaces/Player";
import { selectPlayers } from "@/redux/slices/gameSlice";
import { selectUserId } from "@/redux/slices/userSlice";
import React, { use } from "react";
import { useSelector } from "react-redux";

interface RoleDescriptionProps {
  role: string;
  players: Player[];
  myUserId: string;
}

const getVisiblePlayers = (
  players: Player[],
  role: string,
  myUserId: string
) => {
  let visibleRoles: Role[] = [];
  if (role === "멀린") {
    visibleRoles = ["악의 하수인", "암살자", "모르가나", "오베론"];
  } else if (["악의 하수인", "암살자", "모르가나", "모드레드"].includes(role)) {
    visibleRoles = ["악의 하수인", "암살자", "모르가나", "모드레드"];
  } else if (role === "퍼시발") {
    visibleRoles = ["멀린", "모르가나"];
  }
  return players
    .filter(
      (player) =>
        player.userId !== myUserId && visibleRoles.includes(player.role)
    )
    .map((player) => player.username)
    .join(", ");
};

const getDescriptions = (players: Player[], role: Role, myUserId: string) => {
  if (
    ["멀린", "암살자", "악의 하수인", "모드레드", "모르가나"].includes(role)
  ) {
    return (
      <>
        <p>당신의 눈에 보이는 악의 세력은...</p>
        <p>
          <span style={{ fontWeight: "bold" }}>
            {getVisiblePlayers(players, role, myUserId)}
          </span>
          입니다!
        </p>
      </>
    );
  } else if (role === "퍼시발") {
    return (
      <>
        <p>당신의 눈에 보이는 멀린 후보는...</p>
        <p>
          <span style={{ fontWeight: "bold" }}>
            {getVisiblePlayers(players, role, myUserId)}
          </span>
          입니다!
        </p>
      </>
    );
  } else if (role === "선의 세력") {
    return <p>멀린을 도와 미션을 성공시켜 승리하세요!</p>;
  } else if (role === "오베론") {
    return <p>당신과 다른 악의 하수인들은 서로를 모릅니다.</p>;
  }
};

const RoleDescription = ({ role }: { role: Role }) => {
  const players = useSelector(selectPlayers);
  const myUserId = useSelector(selectUserId);
  return getDescriptions(players, role, myUserId);
};

export default RoleDescription;
