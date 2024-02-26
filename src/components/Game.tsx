import {
  selectDescription,
  selectGameId,
  selectPlayers,
} from "@/redux/slices/gameSlice";
import { selectUserId } from "@/redux/slices/userSlice";
import { Content } from "antd/es/layout/layout";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import FinalResult from "./FinalResult";

import GamePlay from "./GamePlay";
import { EVIL_ROLES } from "@/constants/roles";
import { Player } from "@/interfaces/Player";
import useFirebaseSync from "@/hooks/useFirebaseSync";

export default function Game() {
  const myUserId = useSelector(selectUserId);
  const players = useSelector(selectPlayers);
  const gameId = useSelector(selectGameId);
  const description = useSelector(selectDescription);
  const myself: Player | undefined = players.find((player) => {
    return player.userId === myUserId;
  });

  useFirebaseSync();
  useEffect(() => {
    localStorage.setItem("userId", myUserId);
    localStorage.setItem("gameId", gameId);
  }, [myUserId, gameId]);

  if (!myself) return null;

  const isEvil = EVIL_ROLES.includes(myself?.role as string);

  return (
    <Content>
      {description && <FinalResult description={description} />}
      {!description && <GamePlay isEvil={isEvil} role={myself.role} />}
    </Content>
  );
}
