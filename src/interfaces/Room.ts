export interface RoomDataFromDatabase {
  invitationCode: string;
  participants: { [userId: string]: { userId: string; username: string } };
  ownerId: string;
}
