import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createRoom(teamName, mode) {
  const code = generateRoomCode();
  const { data, error } = await supabase.from('rooms').insert({
    code,
    team_name: teamName,
    mode,
    current_level: 1,
    status: 'lobby'
  }).select().single();

  if (error) throw error;
  return data;
}

export async function joinRoom(code) {
  const { data, error } = await supabase.from('rooms')
    .select()
    .eq('code', code)
    .single();

  if (error) throw error;
  return data;
}

export async function addPlayer(roomId, username, isHost) {
  const { data, error } = await supabase.from('players').insert({
    room_id: roomId,
    username,
    is_host: isHost
  }).select().single();

  if (error) throw error;
  return data;
}

export async function startGame(roomId) {
  const { error } = await supabase.from('rooms')
    .update({ status: 'playing' })
    .eq('id', roomId);

  if (error) throw error;
}

export async function advanceLevel(roomId, levelNum) {
  const { error } = await supabase.from('rooms')
    .update({ current_level: levelNum })
    .eq('id', roomId);

  if (error) throw error;
}

export async function sendChatMessage(roomId, playerName, message, type = 'player') {
  const { error } = await supabase.from('chat_messages').insert({
    room_id: roomId,
    player_name: playerName,
    message,
    type
  });

  if (error) throw error;
}

export function subscribeToRoom(roomId, callback) {
  return supabase.channel(`room:${roomId}`)
    .on('postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms'
      },
      callback
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Room subscription active');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('Room subscription error');
      }
    });
}

export function subscribeToPlayers(roomId, callback) {
  return supabase.channel(`players:${roomId}`)
    .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'players'
      },
      callback
    )
    .subscribe();
}

export function subscribeToChat(roomId, callback) {
  return supabase.channel(`chat:${roomId}`)
    .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages'
      },
      callback
    )
    .subscribe();
}

export function subscribeToTerminalActivity(roomId, callback) {
  return supabase.channel(`terminal:${roomId}`)
    .on('broadcast', { event: 'terminal-output' }, ({ payload }) => callback(payload))
    .subscribe();
}

export async function broadcastTerminalOutput(roomId, playerName, command, outputs) {
  return supabase.channel(`terminal:${roomId}`).send({
    type: 'broadcast',
    event: 'terminal-output',
    payload: { player_name: playerName, command, outputs, ts: Date.now() }
  });
}

export async function getRoomPlayers(roomId) {
  const { data, error } = await supabase.from('players')
    .select()
    .eq('room_id', roomId);

  if (error) throw error;
  return data || [];
}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
