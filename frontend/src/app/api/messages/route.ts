import { NextResponse } from 'next/server';

// メッセージのモックデータ
const mockMessages = [
  {
    id: '1',
    username: 'System',
    message: 'Welcome to the chat!',
    timestamp: new Date(Date.now() - 3600000),
    type: 'system',
  },
  {
    id: '2',
    username: 'Alice',
    message: 'Hello everyone!',
    timestamp: new Date(Date.now() - 3000000),
  },
  {
    id: '3',
    username: 'Bob',
    message: 'Hi Alice, how are you today?',
    timestamp: new Date(Date.now() - 2400000),
  },
];

// GET /api/messages
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const room = searchParams.get('room');
  
  // 実際のアプリではデータベースからメッセージを取得
  // ここではモックデータを使用
  let messages = mockMessages;
  
  // roomパラメータが指定されている場合はフィルタリング
  if (room) {
    // 本来はデータベースクエリでフィルタリングすべき
    messages = messages.filter(msg => !msg.room || msg.room === room);
  }
  
  return NextResponse.json({ messages });
}

// POST /api/messages
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // バリデーション
    if (!body.username || !body.message) {
      return NextResponse.json(
        { error: 'Username and message are required' },
        { status: 400 }
      );
    }
    
    // 実際のアプリではデータベースにメッセージを保存
    const newMessage = {
      id: Date.now().toString(),
      username: body.username,
      message: body.message,
      room: body.room || undefined,
      timestamp: new Date(),
    };
    
    // mockMessages.push(newMessage); // 実際のアプリではDBに保存
    
    return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}