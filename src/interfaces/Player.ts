type Role =
  | "멀린"
  | "암살자"
  | "선의 세력"
  | "악의 하수인"
  | "퍼시발"
  | "모드레드"
  | "모르가나"
  | "오베론";

interface Player {
  userId: string;
  username: string;
  gameId: string;
  role: Role;
}
