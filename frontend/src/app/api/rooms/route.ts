import { NextResponse } from 'next/server';

// ルームのモックデータ
const mockRooms = [
  {
    id: 'room1',
    name: 'Room 1',
    description: 'General discussion',
    userCount: 5,
  },
  {
    id: 'room2',
    name: 'Room 2',
    description: 'Technical topics',
    userCount: 3,
  },
  {
    id: 'room3',
    name: 'Room 3',
    description: 'Random chat',
    userCount: 8,
  },
];

// GET /api/rooms
export async function GET() {
  // 実際のアプリではデータベースからルームを取得
  return NextResponse.json({ rooms: mockRooms });
}