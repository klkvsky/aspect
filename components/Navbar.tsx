"use client";

import clsx from "clsx";

import { useState, useCallback, useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useSupabase } from "../app/supabase-provider";

import {
  UserGroupIcon,
  RectangleStackIcon,
  MagnifyingGlassIcon,
  BellIcon,
  BellAlertIcon,
  AtSymbolIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function Navbar() {
  const [isProfileMenuOpen, SetIsProfileMenuOpen] = useState(false);
  const [newNotifications, setNewNotifications] = useState(true);

  const [session, setSession] = useState<any>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { supabase } = useSupabase();

  const router = useRouter();

  async function signInWithEmail() {
    if (!email) return;

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: "http://localhost:3000/",
      },
    });

    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
    setSession(null);
    router.refresh();
  }

  const sessionData = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log(error);
    }
    setSession(data.session);
  }, [supabase]);

  useEffect(() => {
    sessionData();

    return () => {
      setSession(null);
    };
  }, [sessionData]);

  return (
    <nav className="w-fit h-fit fixed bottom-4 right-1/2 translate-x-1/2 z-50">
      <div
        className={clsx(
          "bg-black/80 backdrop-blur-lg h-full absolute top-0 left-0 transition-all ease-in-out duration-500 rounded-full will-change-transform origin-center border border-neutral-800",
          session
            ? "w-full"
            : loginModalOpen
            ? "w-[270px] -translate-x-1/4"
            : "w-[110px]"
        )}
      />

      <div
        className={clsx(
          "px-2.5 py-2 flex flex-row items-center gap-2.5 transition-all ease-in-out absolute top-0 left-0 -translate-x-[62%] w-full h-full",
          !loginModalOpen
            ? "opacity-0 pointer-events-none -translate-y-[10%]"
            : "delay-200 duration-500"
        )}
      >
        <div className="rounded-full border border-neutral-700 h-[40px] gap-2 px-3 bg-neutral-900/50 transition-all duration-300 ease-in-out flex flex-row items-center group relative min-w-[250px] group focus-within:border-neutral-600 overflow-clip cursor-text">
          <AtSymbolIcon className="w-8 h-8 group-focus-within:-ml-9 transition-all ease-in-out group-focus-within:opacity-0 fill-white/50" />
          <input
            type="text"
            placeholder="Email"
            className="bg-transparent ml-1 text-base outline-none w-full  placeholder:text-white/50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="bg-white/70 hover:bg-white w-6 h-6 rounded-full grid place-items-center aspect-square opacity-0 translate-x-8 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all ease-in-out active:scale-[0.96]"
            onClick={() => {
              signInWithEmail();
            }}
          >
            <AtSymbolIcon className="w-5 h-5 transition-all ease-in-out fill-black/80" />
          </button>
        </div>
        <button
          className={clsx(
            "rounded-full border border-neutral-700 min-w-[40px] h-[40px] aspect-square transition-all ease-in-out duration-300 z-0 grid place-items-center hover:border-neutral-500 group/button cursor-pointer bg-black/80 translate-x-[10px]",
            !loginModalOpen
              ? "opacity-0 pointer-events-none -translate-x-[20%] delay-300"
              : ""
          )}
          onClick={() => {
            setLoginModalOpen(false);
          }}
        >
          <XMarkIcon className="w-1/2 h-auto aspect-square text-white/80  group-hover/button:scale-[1.1] group-hover/button:text-white transition-all ease-in-out" />
        </button>
      </div>

      <div
        className={clsx(
          "px-2.5 py-2 flex flex-row items-center gap-2 transition-all ease-in-out",
          loginModalOpen && "opacity-0 pointer-events-none  translate-y-[20%]"
        )}
      >
        <div className="rounded-full border border-neutral-700 w-[40px] h-auto aspect-square transition-all ease-in-out duration-300 z-0 grid place-items-center hover:border-opacity-40 group/button cursor-pointer bg-black/40">
          <RectangleStackIcon className="w-1/2 h-auto aspect-square text-white/80  group-hover/button:scale-[1.1] group-hover/button:text-white transition-all ease-in-out" />
        </div>
        {session && (
          <div className="flex flex-row items-center gap-2">
            <div className="rounded-full border border-neutral-700 w-[40px] h-auto aspect-square transition-all ease-in-out duration-300 z-0 grid place-items-center hover:border-opacity-40 group/button cursor-pointer bg-black/40">
              <UserGroupIcon className="w-2/4 h-auto aspect-square text-white/80  group-hover/button:scale-[1.1] group-hover/button:text-white transition-all ease-in-out" />
            </div>
            <div className="rounded-full border border-neutral-700 w-[40px] h-auto aspect-square transition-all ease-in-out duration-300 z-0 grid place-items-center hover:border-opacity-40 group/button cursor-pointer bg-black/30">
              <MagnifyingGlassIcon className="w-2/4 h-auto aspect-square text-white/80 group-hover/button:scale-[1.1] group-hover/button:text-white transition-all ease-in-out" />
            </div>
            <div className="rounded-full border border-neutral-700 w-[40px] h-auto aspect-square transition-all ease-in-out duration-300 z-0 grid place-items-center hover:border-opacity-40 group/button cursor-pointer bg-black/40">
              {newNotifications ? (
                <BellAlertIcon className="w-2/4 h-auto aspect-square text-white/80 group-hover/button:scale-[1.1] group-hover/button:text-white transition-all ease-in-out" />
              ) : (
                <BellIcon className="w-2/4 h-auto aspect-square text-white/80 group-hover/button:scale-[1.1] group-hover/button:text-white transition-all ease-in-out" />
              )}
            </div>
          </div>
        )}
        <div
          className="rounded-full border border-neutral-600 w-[40px] h-auto aspect-square transition-all ease-in-out duration-300 z-0 grid place-items-center hover:border-neutral-400 group/avatar cursor-pointer relative bg-black/40"
          onClick={() => {
            if (!session) setLoginModalOpen(!loginModalOpen);
            SetIsProfileMenuOpen(!isProfileMenuOpen);
          }}
        >
          <div
            className={`absolute -top-full right-0 shadow-[0_8px_30px_rgba(255,255,255,.06)] bg-neutral-800 border border-neutral-700 text-white w-[256px] rounded-[8px] h-fit z-[100] flex flex-col text-[14px] overflow-hidden transition-all duration-500 ${
              !isProfileMenuOpen
                ? "opacity-0 translate-x-[5%] scale-95 pointer-events-none  -translate-y-[60%]"
                : "opacity-100 translate-x-[5%] sacle-100 -translate-y-[90%]"
            }`}
          >
            <div className="flex flex-row pt-[12px] pb-[8px] px-[20px] hover:bg-neutral-700 gap-1 capitalize">
              <h4 className="text-[.875rem]">test</h4>
              <p className="opacity-50">testing</p>
            </div>
            <button
              onClick={() => {
                signOut();
                setLoginModalOpen(false);
                SetIsProfileMenuOpen(false);
              }}
              className="pt-[8px] pb-[12px] px-[20px] hover:bg-neutral-700 opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out flex flex-row items-center text-center justify-center"
            >
              Logout
            </button>
          </div>
          {session ? (
            <Image
              src="https://zqjvsefawyzwxbridxjw.supabase.co/storage/v1/object/public/videos/avatars/photo.jpg"
              fill
              priority
              sizes="40px"
              alt="Profile picture of Me"
              className="object-cover rounded-full overflow-hidden aspect-square z-10 h-auto w-full"
            />
          ) : (
            <UserIcon className="w-2/4 h-auto aspect-square text-white/80 group-hover/button:scale-[1.1] group-hover/button:text-white transition-all ease-in-out" />
          )}
        </div>
      </div>
    </nav>
  );
}
