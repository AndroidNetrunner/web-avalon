import styles from "../app/page.module.css";
import Entry from "@/components/Entry";
import { selectUserId } from "@/redux/slices/userSlice";
import Room from "@/components/Room";
import Game from "@/components/Game";
import { useSelector } from "react-redux";
import { selectGameId } from "@/redux/slices/gameSlice";
import React from "react";

export default function Home() {
  let userId: string | null = useSelector(selectUserId);
  let gameId: string | null = useSelector(selectGameId);
  if (typeof window !== "undefined") {
    if (localStorage.getItem("userId")) userId = localStorage.getItem("userId");
    if (localStorage.getItem("gameId")) gameId = localStorage.getItem("gameId");
  }

  return (
    <>
      <main className={styles.main}>
        {!userId ? <Entry /> : gameId ? <Game /> : <Room />}
      </main>
    </>
  );
}
