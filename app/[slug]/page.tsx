"use client";

import clsx from "clsx";

import { Video } from "@/interfaces/video";
import { User } from "@/interfaces/user";

import { useSupabase } from "../supabase-provider";

import {
  IncreaseSizeOfCard,
  DecreaseSizeOfCard,
  UpdateProfileCardAspectRatio,
} from "@/lib/videoUtils";

import Muuri from "muuri";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import VideoCard from "@/components/VIdeoCard";
import ProfileCard from "@/components/ProfileCard";
import AddNewVideo from "@/components/AddNewVideo";

export default function PersonalPage() {
  const pathname = usePathname();
  const { supabase } = useSupabase();

  const [gridRefence, setGridRefence] = useState<any>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [profileCardIndex, setProfileCardIndex] = useState<number>(110);

  const [syncingObject, setSyncingObject] = useState<any>(null);
  const [syncingStatus, setSyncingStatus] = useState<string>("");

  const [profile, setProfile] = useState<User>();

  async function fetchProfile() {
    const { data, error } = await supabase.auth.getUser();

    if (data) {
      setProfile(data.user as unknown as User);
      console.log(data);
    } else {
      console.error(error);
    }
  }

  const [videoInFullscreen, setVideoInFullscreen] = useState<number>(-1);

  const fetchVideos = useCallback(async () => {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("author", pathname.split("/")[1]);

    if (error) {
      console.log(error);
    } else {
      // reorder videos based on position parameter
      const orderedVideos = data.sort((a, b) => {
        return a.position - b.position;
      });

      setVideos(orderedVideos as unknown as Video[]);
    }
  }, [pathname, supabase]);

  useEffect(() => {
    if (videos.length !== 0) {
      const grid = new Muuri(".gridMuui", {
        items: ".item",
        dragEnabled: profile?.user_metadata.email.split("@")[0] === pathname.split("/")[1],
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
    } else {
      fetchVideos();
      fetchProfile();
    }
  }, [videos]);

  function onOpenInFullscreen(index: number) {
    if (!videoInFullscreen || videoInFullscreen === -1) {
      console.log("index in function: ", index);
      setVideoInFullscreen(index);
    } else {
      setVideoInFullscreen(-1);
    }
  }

  async function findNewVideo() {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("author", pathname.split("/")[1]);

    if (error) {
      console.error(error);
    } else {
      setVideos(data as unknown as Video[]);
    }
  }

  function convertAspectRatio(decimalRatio: number): string {
    // Multiply the decimal by 100 to simplify it
    const simplifiedDecimal = decimalRatio * 100;

    // Find the greatest common divisor (GCD) of the simplified decimal and 100
    const gcd = (a: number, b: number): number => {
      if (b === 0) {
        return a;
      } else {
        return gcd(b, a % b);
      }
    };
    const divisor = gcd(simplifiedDecimal, 100);

    // Divide the simplified decimal and 100 by the GCD to get the numerator and denominator of the ratio
    const numerator = simplifiedDecimal / divisor;
    const denominator = 100 / divisor;

    // Return the ratio as a string in the form of x:y
    return `${numerator}:${denominator}`;
  }

  const updateEachVideoOrder = useCallback(
    async (item: string, index: number) => {
      const { data, error } = await supabase
        .from("videos")
        .update({ position: index })
        .eq("id", item);

      if (error) {
        console.error(error);
      } else {
        if (index === videos.length - 1) {
          setSyncingStatus("Synced");
          setTimeout(() => {
            setSyncingObject(null);
          }, 1000);
        }
      }
    },
    [supabase, videos.length]
  );

  const updateOrder = useCallback(() => {
    const order = gridRefence
      .getItems()
      .map((item: any) => item.getElement().getAttribute("data-name"));

    order.forEach((item: any, index: number) => {
      updateEachVideoOrder(item, index);
    });
  }, [gridRefence, updateEachVideoOrder]);

  useEffect(() => {
    if (gridRefence) {
      gridRefence.on("dragEnd", (item: any) => {
        const videoId = item.getElement().id;
        setSyncingObject(videoId);
        setSyncingStatus("Syncing");
        updateOrder();
      });
    }
  }, [gridRefence, updateOrder]);

  const deleteVideo = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("videos").delete().eq("id", id);

      if (error) {
        console.error(error);
      } else {
        if (gridRefence) {
          gridRefence.remove([`#item-${id}`], { removeElements: true });
        }
      }
    },
    [supabase, gridRefence]
  );

  return (
    <main className="mt-6 w-full">
      <div
        className={clsx(
          "fixed top-0 left-0 w-screen !z-[888] h-screen bg-black/50 backdrop-blur-lg transition-all ease-in-out duration-300",
          videoInFullscreen !== -1
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />
      {profile?.user_metadata.email.split("@")[0] ===
        pathname.split("/")[1] && (
        <AddNewVideo
          addNewVideoToGrid={() => {
            findNewVideo();
          }}
          videoLength={videos.length}
        />
      )}
      <div className="gridMuui">
        {videos.map((video: any, index: number) =>
          index === profileCardIndex ? (
            <div
              key={index}
              className={clsx("item relative", video.sizeClass)}
              id={`item-${index}`}
              data-name={"profile-card"}
            >
              {!videoInFullscreen && (
                <div
                  className={clsx(
                    "absolute top-[9px] left-[9px] w-[calc(100%-18px)] h-[calc(100%-18px)] rounded-[14px] overflow-hidden transition-all ease-in-out before:transition-all before:ease-in-out",
                    syncingObject === `item-${index}`
                      ? "special-button"
                      : "notLoading"
                  )}
                />
              )}
              {!videoInFullscreen && (
                <div
                  className={clsx(
                    "flex flex-row items-center gap-1 bg-black/50 px-2.5 py-1 rounded-full border border-neutral-600 w-fit mx-auto backdrop-blur-md absolute top-16 left-1/2 -translate-x-1/2 z-20 text-xs transition-all ease-in-out duration-300",
                    syncingObject === `item-${index}`
                      ? syncingStatus === "Syncing" && "animate-pulse"
                      : "opacity-0 pointer-events-none -translate-y-4"
                  )}
                >
                  {syncingStatus}
                </div>
              )}
              <div className={`item-content p-[10px] w-full h-full`}>
                <ProfileCard
                  key={index}
                  photo="https://zqjvsefawyzwxbridxjw.supabase.co/storage/v1/object/public/videos/avatars/avatar.png"
                  username={pathname.split("/")[1]}
                  updateAspectRatio={(ratio) => {
                    UpdateProfileCardAspectRatio(ratio, gridRefence, index);
                  }}
                  onIncrease={() => {
                    IncreaseSizeOfCard(index, gridRefence, video.id, supabase);
                  }}
                  onDecrease={() => {
                    DecreaseSizeOfCard(index, gridRefence, video.id, supabase);
                  }}
                />
              </div>
            </div>
          ) : (
            <div
              key={index}
              className={clsx(
                "item relative",
                "item--" + video.size,
                videoInFullscreen - 1 === index && "!z-[999]"
              )}
              data-name={video.id}
              id={`item-${index}`}
            >
              {profile?.user_metadata.email.split("@")[0] ===
                pathname.split("/")[1] &&
                !videoInFullscreen && (
                  <div
                    className={clsx(
                      "absolute top-[7.5px] left-[7.5px] w-[calc(100%-15px)] h-[calc(100%-15px)] rounded-[14px] overflow-hidden transition-all ease-in-out before:transition-all before:ease-in-out",
                      syncingObject === `item-${index}`
                        ? "special-button"
                        : "notLoading"
                    )}
                  />
                )}
              {profile?.user_metadata.email.split("@")[0] ===
                pathname.split("/")[1] &&
                !videoInFullscreen && (
                  <div
                    className={clsx(
                      "flex flex-row items-center gap-1 bg-black/50 px-2.5 py-1 rounded-full border border-neutral-600 w-fit mx-auto backdrop-blur-md absolute top-6 left-1/2 -translate-x-1/2 z-20 text-xs transition-all ease-in-out duration-300",
                      syncingObject === `item-${index}`
                        ? syncingStatus === "Syncing" && "animate-pulse"
                        : "opacity-0 pointer-events-none -translate-y-4"
                    )}
                  >
                    {syncingStatus}
                  </div>
                )}
              <div
                className="item-content p-[10px] w-full h-full relative z-10"
                style={
                  video.aspect_ratio !== 0
                    ? {
                        aspectRatio: video.aspect_ratio,
                      }
                    : {
                        aspectRatio: "16:9",
                      }
                }
              >
                {!videoInFullscreen && (
                  <div className="absolute top-[11px] left-[11px] w-[calc(100%-22px)] h-[calc(100%-22px)] rounded-[14px] bg-neutral-900 animate-pulse" />
                )}
                <VideoCard
                  videoMetaData={video}
                  onLoad={() => {
                    gridRefence.refreshItems().layout();
                  }}
                  onDecrease={() => {
                    DecreaseSizeOfCard(index, gridRefence, video.id, supabase);
                  }}
                  onIncrease={() => {
                    IncreaseSizeOfCard(index, gridRefence, video.id, supabase);
                  }}
                  isUser={
                    profile?.user_metadata.email.split("@")[0] ===
                    pathname.split("/")[1]
                  }
                  onOpenInFullscreen={() => {
                    onOpenInFullscreen(index + 1);
                  }}
                  onDelete={() => {
                    deleteVideo(video.id);
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}
