export type WinDescription = keyof typeof winDescriptions;

const winDescriptions = {
  "암살 성공으로 인한 악의 하수인 승리": false,
  "미션 3번 실패로 인한 악의 하수인 승리": false,
  "투표 5번 부결로 인한 악의 하수인 승리": false,
  "미션 3번 성공 및 암살 실패로 인한 선의 세력 승리": true,
};

export default winDescriptions;
