import {
  selectPlayers,
  selectRoundFail,
  selectRoundSuccess,
} from "@/redux/slices/gameSlice";
import { selectMission, setMission } from "@/redux/slices/resultSlice";
import { selectMissionTeam } from "@/redux/slices/roundSlice";
import { Button, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";

function missionCount(missionResult: string[]) {
  let successCount = 0;
  let failCount = 0;
  missionResult.forEach((result) => {
    if (result === "fail") {
      failCount++;
    } else successCount++;
  });
  return { successCount, failCount };
}

// 미션 성공, 실패 판정 방법?
export default function MissionResult() {
  const missionRoundNumber =
    useSelector(selectRoundSuccess) + useSelector(selectRoundFail);
  const players = useSelector(selectPlayers);
  const missionTeam = useSelector(selectMissionTeam);
  const openMission = useSelector(selectMission);
  const { successCount, failCount } = missionCount(Object.values(missionTeam));
  const isMissionSuccessful =
    Object.values(missionTeam).every((v) => v === "success") ||
    (players.length >= 7 && failCount <= 1 && missionRoundNumber === 4);
  const dispatch = useDispatch();
  return (
    <Modal
      open={openMission}
      title={
        <span style={{ color: isMissionSuccessful ? "blue" : "red" }}>
          {isMissionSuccessful
            ? "미션이 성공하였습니다!"
            : "미션이 실패하였습니다..."}
        </span>
      }
      footer={
        <Button type="primary" onClick={() => dispatch(setMission(false))}>
          확인
        </Button>
      }
    >
      <p>미션 성공: {successCount}</p>
      <p>미션 실패: {failCount}</p>
    </Modal>
  );
}
