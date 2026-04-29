'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  FileText,
  FileVideo2,
  Folder,
  ImageIcon,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { getExplorerByRoom, listRooms } from '@/services/apiClient';
import type { ApiRoom, ApiRoomMediaGroup } from '@/types/api';
import { cn } from '@/utils/cn';

interface RoomDates {
  byDate: Record<string, ApiRoomMediaGroup>;
  isLoading: boolean;
  error: string | null;
}

export function FileTree() {
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [openRoom, setOpenRoom] = useState<string | null>(null);
  const [dataByRoom, setDataByRoom] = useState<Record<string, RoomDates>>({});

  useEffect(() => {
    let cancelled = false;
    listRooms()
      .then((res) => {
        if (!cancelled) setRooms(res);
      })
      .catch((err) => {
        if (!cancelled) setRoomsError(err instanceof Error ? err.message : 'Could not load rooms.');
      })
      .finally(() => {
        if (!cancelled) setRoomsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleRoom = (slug: string) => {
    setOpenRoom((cur) => (cur === slug ? null : slug));
    if (dataByRoom[slug]) return;
    setDataByRoom((prev) => ({ ...prev, [slug]: { byDate: {}, isLoading: true, error: null } }));
    getExplorerByRoom(slug)
      .then((res) => {
        setDataByRoom((prev) => ({
          ...prev,
          [slug]: { byDate: res.dates ?? {}, isLoading: false, error: null },
        }));
      })
      .catch((err) => {
        setDataByRoom((prev) => ({
          ...prev,
          [slug]: {
            byDate: {},
            isLoading: false,
            error: err instanceof Error ? err.message : 'Failed to load room.',
          },
        }));
      });
  };

  if (roomsLoading) {
    return (
      <div className="space-y-1.5 px-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="shimmer h-7 rounded" />
        ))}
      </div>
    );
  }

  if (roomsError) {
    return <p className="px-2 text-[11px] text-red-400">{roomsError}</p>;
  }

  if (!rooms.length) {
    return (
      <p className="px-2 font-mono text-[10px] uppercase tracking-wider text-[#484F58]">
        No rooms yet
      </p>
    );
  }

  return (
    <ul className="space-y-0.5">
      {rooms.map((room) => {
        const isOpen = openRoom === room.slug;
        const data = dataByRoom[room.slug];
        return (
          <li key={room.id}>
            <button
              type="button"
              onClick={() => toggleRoom(room.slug)}
              className="group flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs text-[#C9D1D9] transition-colors hover:bg-base-800/60 hover:text-amber-500"
            >
              <ChevronRight
                size={12}
                className={cn(
                  'shrink-0 text-[#8B949E] transition-transform',
                  isOpen && 'rotate-90 text-amber-500',
                )}
              />
              <Folder size={12} className="shrink-0 text-amber-500/80" />
              <span className="truncate">{room.name}</span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <RoomBody room={room} data={data} />
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

function RoomBody({ room, data }: { room: ApiRoom; data: RoomDates | undefined }) {
  if (!data || data.isLoading) {
    return (
      <div className="ml-5 mt-1 space-y-1">
        {[0, 1].map((i) => (
          <div key={i} className="shimmer h-5 rounded" />
        ))}
      </div>
    );
  }
  if (data.error) {
    return <p className="ml-5 mt-1 text-[10px] text-red-400">{data.error}</p>;
  }

  const dateEntries = Object.entries(data.byDate).sort(([a], [b]) => (a < b ? 1 : -1));
  if (!dateEntries.length) {
    return (
      <p className="ml-5 mt-1 font-mono text-[10px] uppercase tracking-wider text-[#484F58]">
        No captures
      </p>
    );
  }

  return (
    <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-base-800/80 pl-2">
      {dateEntries.map(([date, group]) => (
        <DateBranch key={date} room={room} date={date} group={group} />
      ))}
    </ul>
  );
}

function DateBranch({ room, date, group }: { room: ApiRoom; date: string; group: ApiRoomMediaGroup }) {
  const [open, setOpen] = useState(false);
  const total =
    (group.images?.length ?? 0) +
    (group.videos?.length ?? 0) +
    (group.pointclouds?.length ?? 0) +
    (group.pdfs?.length ?? 0);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[11px] text-[#C9D1D9] transition-colors hover:bg-base-800/60"
      >
        <ChevronRight
          size={10}
          className={cn(
            'shrink-0 text-[#8B949E] transition-transform',
            open && 'rotate-90 text-amber-500',
          )}
        />
        <span className="font-mono text-[10px] tracking-wide">{date}</span>
        <span className="ml-auto rounded bg-base-800 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#8B949E]">
          {total}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <ul className="ml-3 space-y-0.5 border-l border-base-800/80 pl-2 py-1">
              <MediaBucket icon={<ImageIcon size={10} />} label="Images" count={group.images.length} room={room.slug} date={date} />
              <MediaBucket icon={<FileVideo2 size={10} />} label="Videos" count={group.videos.length} room={room.slug} date={date} />
              <MediaBucket icon={<Layers size={10} />} label="Point Clouds" count={group.pointclouds.length} room={room.slug} date={date} />
              <MediaBucket icon={<FileText size={10} />} label="PDFs" count={group.pdfs.length} room={room.slug} date={date} />
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function MediaBucket({
  icon,
  label,
  count,
  room,
  date,
}: {
  icon: ReactNode;
  label: string;
  count: number;
  room: string;
  date: string;
}) {
  if (count === 0) return null;
  return (
    <li>
      <Link
        href={`/app/room-explorer?room=${encodeURIComponent(room)}&date=${date}`}
        className="flex items-center gap-1.5 rounded px-1.5 py-1 text-[11px] text-[#8B949E] transition-colors hover:bg-base-800/60 hover:text-amber-500"
      >
        <span className="text-amber-500/80">{icon}</span>
        <span>{label}</span>
        <span className="ml-auto font-mono text-[9px] text-[#484F58]">{count}</span>
      </Link>
    </li>
  );
}
