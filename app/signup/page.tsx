"use client";

import { usePathname } from "next/navigation";
import Muuri from "muuri";

import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "../supabase-provider";

import clsx from "clsx";
import {
  CheckCircleIcon,
  AtSymbolIcon,
  KeyIcon,
  EnvelopeIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

import VideoCard from "@/components/VIdeoCard";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { supabase } = useSupabase();
  const pathname = usePathname();
  const router = useRouter();

  const [isTyping, setIsTyping] = useState(false);
  const [isHandleAvailable, setIsHandleAvailable] = useState(false);
  const [handle, setHandle] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSigningUp, setIsSigningUp] = useState(false);

  async function checkIfHandleAbailable() {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", handle);

    if (error) {
      console.log(error);
    } else {
      if (data.length === 0) {
        setIsHandleAvailable(true);
      } else {
        setIsHandleAvailable(false);
      }
    }
  }

  useEffect(() => {
    checkIfHandleAbailable();

    let typingTimeout: NodeJS.Timeout;

    const handleKeyDown = () => {
      clearTimeout(typingTimeout);
      setIsTyping(true);

      typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 200);
    };

    handleKeyDown();

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [handle]);

  //

  const [gridRefence, setGridRefence] = useState<any>(null);
  const [videos, setVideos] = useState<any>([]);

  const fetchVideos = useCallback(async () => {
    const { data, error } = await supabase.storage
      .from("videos")
      .list(pathname.split("/")[1], {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data) {
      setVideos(data);
    } else {
      console.error(error);
    }
  }, [pathname, supabase]);

  useEffect(() => {
    if (videos.length === 0) {
      fetchVideos();
    } else {
      const grid = new Muuri(".gridMuui", {
        items: ".item",
        dragEnabled: true,
        layout: {
          fillGaps: true,
          horizontal: false,
          alignRight: false,
          alignBottom: false,
          rounding: false,
        },
      });

      setGridRefence(grid);

      setTimeout(() => {
        grid.refreshItems().layout();
      }, 200);

      return () => {
        grid.destroy();
      };
    }
  }, [videos, fetchVideos]);

  async function signUp() {
    console.log("signing up", email, password, handle);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: handle,
        },
      },
    });

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      router.push("/");
    }
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col lg:flex-row bg-neutral-900">
      <form
        className="flex flex-col items-center lg:items-start px-10 pt-[30vh] w-full lg:w-2/6 h-full gap-4 z-10 relative bg-gradient-to-b from-neutral-900/0 via-neutral-950 via-[35%] to-neutral-950"
        onSubmit={(e) => {
        e.preventDefault();
        }}
      >
        <h1 className="text-3xl font-bold transition-all ease-out duration-300 w-7/12 mr-auto">
          {handle.length > 3 && !isTyping && isHandleAvailable
            ? "Complete Registration"
            : "Choose your handle"}
        </h1>
        <div className="rounded-full border border-neutral-700 h-[40px] gap-2 px-3 bg-neutral-900/50 transition-all duration-300 ease-in-out flex flex-row items-center group relative w-full max-w-[300px] group focus-within:border-neutral-600 overflow-clip cursor-text mt-4">
          <AtSymbolIcon className="w-5 h-5 group-focus-within:-ml-5 transition-all ease-in-out group-focus-within:opacity-0 fill-white/50" />
          <input
            type="text"
            placeholder="Handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="bg-transparent ml-1 text-base outline-none w-full  placeholder:text-white/50"
          />

          <CheckCircleIcon
            className={clsx(
              "absolute top-1/2 -translate-y-1/2 right-2 w-5 h-5 transition-all ease-in-out",
              !isTyping && handle.length > 3
                ? isHandleAvailable
                  ? "text-green-500"
                  : "text-red-500"
                : "text-neutral-500",
              isTyping && "animate-pulse"
            )}
          />
        </div>

        <div
          className={clsx(
            "flex flex-col gap-4 mt-5 transition-all ease-in-out duration-300 w-full items-center lg:items-start",
            !isTyping && handle.length > 3 && isHandleAvailable
              ? "opacity-100"
              : "opacity-0 -mb-64"
          )}
        >
          <div className="rounded-full border border-neutral-700 h-[40px] gap-2 px-3 bg-neutral-900/50 transition-all duration-300 ease-in-out flex flex-row items-center group relative  w-full max-w-[300px] group focus-within:border-neutral-600 overflow-clip cursor-text">
            <EnvelopeIcon className="w-5 h-5 group-focus-within:-ml-5 transition-all ease-in-out group-focus-within:opacity-0 fill-white/50" />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent ml-1 text-base outline-none w-full  placeholder:text-white/50"
            />
          </div>
          <div className="rounded-full border border-neutral-700 h-[40px] gap-2 px-3 bg-neutral-900/50 transition-all duration-300 ease-in-out flex flex-row items-center group relative w-full max-w-[300px] group focus-within:border-neutral-600 overflow-clip cursor-text">
            <KeyIcon className="w-5 h-5 group-focus-within:-ml-5 transition-all ease-in-out group-focus-within:opacity-0 fill-white/50" />
            <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent ml-1 text-base outline-none w-full  placeholder:text-white/50"
            />
          </div>

          <button
            className="rounded-full border border-neutral-700 w-full transition-all ease-in-out duration-300 z-0 hover:border-opacity-40 group/button cursor-pointer bg-black/30 flex flex-row items-center justify-center gap-3 py-2 max-w-[300px]"
            onClick={() => {
              signUp();
            }}
          >
            <span>Sign Up</span>
            <ArrowLeftOnRectangleIcon className="w-[16px] h-auto aspect-square text-white/80 group-hover/button:scale-[1.1] group-hover/button:-scale-x-[1.1] group-hover/button:text-white transition-all ease-in-out" />
          </button>
        </div>
      </form>

      <div className="w-full lg:w-4/6 h-full overflow-hidden lg:overflow-scroll lg:z-20 lg:relative fixed top-0 left-0 z-0">
        <div className="gridMuui relative">
          {videos.map((video: any, index: any) => (
            <div
              key={index}
              className={clsx("item")}
              id={`item-${index}`}
              style={{
                width: "50%",
              }}
            >
              <div className={`item-content p-[5px] w-full h-full`}>
                <VideoCard
                  videoMetaData={video}
                  onLoad={() => {
                    gridRefence.refreshItems().layout();
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
