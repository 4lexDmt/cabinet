-- Cabinet schema v1
-- nation.force is derived in the simulation (economy, standing_internal, supply).
-- Never written by clients. Documented here so operators do not add a writable column.

create extension if not exists pgcrypto;

create table if not exists scenario (
  id text primary key,
  display_name text not null,
  config jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists match (
  id uuid primary key default gen_random_uuid(),
  scenario_id text not null references scenario(id),
  seed integer not null,
  status text not null default 'lobby' check (status in ('lobby', 'active', 'closed')),
  tick integer not null default 0,
  world_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nation (
  match_id uuid not null references match(id) on delete cascade,
  id text not null,
  name text not null,
  player_id uuid,
  standing_external integer not null,
  standing_internal integer not null,
  economy integer not null,
  intelligence_capacity integer not null,
  supply integer not null,
  status text not null,
  -- force is write-only-by-simulation / derived. Not a stored column.
  primary key (match_id, id)
);

create table if not exists territory (
  match_id uuid not null references match(id) on delete cascade,
  id text not null,
  name text not null,
  owner text not null,
  controller text not null,
  region text not null,
  supply_value integer not null,
  primary key (match_id, id)
);

create table if not exists formation (
  match_id uuid not null references match(id) on delete cascade,
  id text not null,
  nation_id text not null,
  location text not null,
  destination text,
  strength integer not null,
  in_transit boolean not null default false,
  primary key (match_id, id)
);

create table if not exists pact (
  match_id uuid not null references match(id) on delete cascade,
  id text not null,
  parties text[] not null,
  secret boolean not null default false,
  visible_to uuid[] not null default '{}',
  public_terms jsonb not null,
  private_terms jsonb not null,
  status text not null,
  broken_by text,
  broken_tick integer,
  primary key (match_id, id)
);

create table if not exists event (
  id text primary key,
  match_id uuid not null references match(id) on delete cascade,
  tick integer not null,
  type text not null,
  actor_id text,
  subject_ids text[] not null default '{}',
  payload jsonb not null default '{}'::jsonb,
  visibility_rule jsonb not null,
  cause_event_id text,
  created_at timestamptz not null default now()
);

create table if not exists belief (
  match_id uuid not null references match(id) on delete cascade,
  observer_nation_id text not null,
  subject_type text not null,
  subject_id text not null,
  field text not null,
  believed_value jsonb not null,
  confidence numeric not null,
  source text not null check (source in (
    'direct_observation', 'ally_share', 'purchased_intel', 'inference', 'planted'
  )),
  last_updated_tick integer not null,
  primary key (match_id, observer_nation_id, subject_type, subject_id, field)
);

create table if not exists channel (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references match(id) on delete cascade,
  kind text not null check (kind in ('public', 'group', 'dm', 'backchannel')),
  member_nation_ids text[] not null,
  title text not null
);

create table if not exists message (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references channel(id) on delete cascade,
  match_id uuid not null references match(id) on delete cascade,
  author_nation_id text not null,
  body text not null,
  quote_of uuid,
  created_tick integer not null,
  created_at timestamptz not null default now()
);

create table if not exists order_queue (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references match(id) on delete cascade,
  nation_id text not null,
  payload jsonb not null,
  submitted_tick integer not null,
  seq integer not null,
  consumed_at timestamptz,
  claimed_at timestamptz,
  claimed_by text,
  created_at timestamptz not null default now()
);

create table if not exists posture (
  match_id uuid not null references match(id) on delete cascade,
  nation_id text not null,
  engagement text not null,
  delegation jsonb not null default '[]'::jsonb,
  primary key (match_id, nation_id)
);

create table if not exists advisor_state (
  match_id uuid not null references match(id) on delete cascade,
  nation_id text not null,
  last_seen_tick integer not null default 0,
  digest jsonb not null default '{}'::jsonb,
  primary key (match_id, nation_id)
);

create index if not exists pact_match_status on pact (match_id, status);
create index if not exists belief_observer on belief (match_id, observer_nation_id);
create index if not exists event_match_tick on event (match_id, tick);
create index if not exists order_queue_claim on order_queue (match_id) where consumed_at is null;

create or replace function event_append_only() returns trigger as $$
begin
  raise exception 'event log is append-only';
end;
$$ language plpgsql;

drop trigger if exists event_no_update on event;
create trigger event_no_update
  before update or delete on event
  for each row execute function event_append_only();

alter table scenario enable row level security;
alter table match enable row level security;
alter table nation enable row level security;
alter table territory enable row level security;
alter table formation enable row level security;
alter table pact enable row level security;
alter table event enable row level security;
alter table belief enable row level security;
alter table channel enable row level security;
alter table message enable row level security;
alter table order_queue enable row level security;
alter table posture enable row level security;
alter table advisor_state enable row level security;

create or replace function current_nation_id(p_match uuid) returns text as $$
  select id from nation
  where match_id = p_match and player_id = auth.uid()
  limit 1;
$$ language sql stable security definer set search_path = public;

create policy event_visible on event
  for select using (
    (visibility_rule->>'kind') = 'public'
    or (
      (visibility_rule->>'kind') = 'nations'
      and visibility_rule->'nation_ids' ? current_nation_id(match_id)
    )
  );

create policy belief_observer_only on belief
  for select using (observer_nation_id = current_nation_id(match_id));

create policy nation_own_or_public on nation
  for select using (player_id = auth.uid() or true);

create policy order_insert_own on order_queue
  for insert with check (nation_id = current_nation_id(match_id));
