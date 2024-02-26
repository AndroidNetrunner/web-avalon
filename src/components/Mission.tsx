import { Player, Role } from "@/interfaces/Player";
import { selectPlayers } from "@/redux/slices/gameSlice";
import { selectUserId } from "@/redux/slices/userSlice";
import React from "react";
import { useSelector } from "react-redux";
import MissionCard from "./MissionCard";
import MissionButtons from "./MissionButtons";
import { EVIL_ROLES } from "@/constants/roles";

function isEvil(userId: string, players: Player[]): boolean {
  return EVIL_ROLES.includes(
    players.find((player) => player.userId === userId)?.role as Role
  );
}

export default function Mission() {
  const players = useSelector(selectPlayers);
  const myUserId = useSelector(selectUserId);
  const amEvil = isEvil(myUserId, players);
  return (
    <>
      <MissionCard />
      <MissionButtons amEvil={amEvil} />
    </>
  );
}
