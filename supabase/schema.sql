-- Room table
create table rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  team_name text not null,
  mode text not null default 'normal', -- 'normal' | 'timed'
  current_level int not null default 0,
  status text not null default 'lobby', -- 'lobby' | 'playing' | 'complete'
  created_at timestamptz default now()
);

-- Players table
create table players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  username text not null,
  is_host boolean default false,
  joined_at timestamptz default now()
);

-- Chat messages table
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  player_name text,
  message text not null,
  type text default 'player', -- 'player' | 'system' | 'success' | 'snippet'
  created_at timestamptz default now()
);

-- Enable realtime on all tables
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table players;
alter publication supabase_realtime add table chat_messages;
