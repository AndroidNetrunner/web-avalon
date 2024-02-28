import { Player } from "@/interfaces/Player";
import {
  selectPlayers,
  selectRoundFail,
  selectRoundSuccess,
} from "@/redux/slices/gameSlice";
import { selectMission, setMission } from "@/redux/slices/resultSlice";
import { selectMissionTeam } from "@/redux/slices/roundSlice";
import { Button, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

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

function judgeMissionSuccess(
  failCount: number,
  missionRoundNumber: number
): boolean {
  if (missionRoundNumber === 4) return failCount <= 1;
  return failCount < 1;
}

export default function MissionResult() {
  const missionRoundNumber =
    useSelector(selectRoundSuccess) + useSelector(selectRoundFail);
  const missionTeam = useSelector(selectMissionTeam);
  const openMission = useSelector(selectMission);
  const { successCount, failCount } = missionCount(Object.values(missionTeam));
  const isMissionSuccessful = judgeMissionSuccess(
    failCount,
    missionRoundNumber
  );
  const dispatch = useDispatch();

  const StyledSpan = styled.span<{ isMissionSuccessful: boolean }>`
    color: ${(props) => (props.isMissionSuccessful ? "blue" : "red")};
  `;

  return (
    <Modal
      open={openMission}
      title={
        <StyledSpan isMissionSuccessful={isMissionSuccessful}>
          {isMissionSuccessful
            ? "미션이 성공하였습니다!"
            : "미션이 실패하였습니다..."}
        </StyledSpan>
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
