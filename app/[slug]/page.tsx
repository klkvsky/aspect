"use client";

import clsx from "clsx";

import { Video } from "@/interfaces/video";
import { User } from "@/interfaces/user";

import { useSupabase } from "../supabase-provider";

import {
  increaseSizeOfCard,
  decreaseSizeOfCard,
  updateProfileCardAspectRatio,
} from "@/lib/videoUtils";

import Muuri from "muuri";
import { useCallback, useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import VideoCard from "@/components/VIdeoCard";
import ProfileCard from "@/components/ProfileCard";

export default function PersonalPage() {
  const pathname = usePathname();
  const { supabase } = useSupabase();

  const [gridRefence, setGridRefence] = useState<any>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoOrder, setVideoOrder] = useState<string[]>([]);

  const [profile, setProfile] = useState<User>();

  const fetchProfile = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();

    if (data) {
      setProfile(data.user as unknown as User);
    } else {
      console.error(error);
    }
  }, [supabase]);

  const fetchVideos = useCallback(
    async (videoOrder: string[]) => {
      const { data, error } = await supabase.storage
        .from("videos")
        .list(pathname.split("/")[1], {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (data) {
        reorderVideos(data as unknown as Video[], videoOrder);
      } else {
        console.error(error);
      }
    },
    [pathname, supabase]
  );

  const getVideoOrder = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("videos_order")
      .eq("username", pathname.split("/")[1]);

    if (error) {
      console.error(error);
    } else {
      console.log("data", data[0].videos_order);
      fetchVideos(data[0].videos_order);
    }
  }, [supabase, pathname, fetchVideos]);

  const reorderVideos = useCallback((videos: Video[], videoOrder: string[]) => {
    const reorderedVideos: Video[] = [];

    // Iterate through the videoOrder array
    for (const videoName of videoOrder) {
      // Find the video in the videos array with the same file name
      const video = videos.find((v) => v.name === videoName);

      // If the video is found, add it to the reorderedVideos array
      if (video) {
        reorderedVideos.push(video);
      }
    }

    // Add any remaining videos that were not in the videoOrder array
    for (const video of videos) {
      if (!reorderedVideos.includes(video)) {
        reorderedVideos.push(video);
      }
    }

    setVideos(reorderedVideos);
  }, []);

  const updateVideoOrder = useCallback(async () => {
    const newOrder = gridRefence.getItems().map((item: any) => {
      return item.getElement().getAttribute("data-name");
    });

    const { error, data } = await supabase
      .from("profiles")
      .update({ videos_order: newOrder })
      .eq("username", pathname.split("/")[1].toString())
      .select("*");

    if (error) {
      console.error(error);
    } else {
      console.log('success');
      console.log('data 2', data);
    }
  }, [gridRefence, supabase, pathname]);

  useEffect(() => {
    if (videoOrder.length === 0) {
      getVideoOrder();
    }
  }, [getVideoOrder, videoOrder]);

  useEffect(() => {
    if (videos.length !== 0) {
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
  }, [videos]);

  useEffect(() => {
    if (gridRefence) {
      gridRefence.on("dragEnd", () => {
        updateVideoOrder();
      });
    }
  }, [gridRefence, updateVideoOrder]);

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [fetchProfile]);

  return (
    <main className="mt-6 w-full">
      <div className="gridMuui">
        {videos.map((video: any, index: number) =>
          index === 6 ? (
            <div
              key={index}
              className={clsx("item")}
              id={`item-${index}`}
              data-name={"profile-card"}
            >
              <div className={`item-content p-[10px] w-full h-full`}>
                <ProfileCard
                  key={index}
                  photo="https://zqjvsefawyzwxbridxjw.supabase.co/storage/v1/object/public/videos/avatars/avatar.png"
                  username={pathname.split("/")[1]}
                  updateAspectRatio={(ratio) => {
                    updateProfileCardAspectRatio(ratio, gridRefence);
                  }}
                  onIncrease={() => {
                    increaseSizeOfCard(index, gridRefence);
                  }}
                  onDecrease={() => {
                    decreaseSizeOfCard(index, gridRefence);
                  }}
                />
              </div>
            </div>
          ) : (
            <div
              key={index}
              className={clsx("item")}
              data-name={video.name}
              id={`item-${index}`}
            >
              <div className={`item-content p-[10px] w-full h-full`}>
                <VideoCard
                  videoMetaData={video}
                  onLoad={() => {
                    gridRefence.refreshItems().layout();
                  }}
                  onDecrease={() => {
                    decreaseSizeOfCard(index, gridRefence);
                  }}
                  onIncrease={() => {
                    increaseSizeOfCard(index, gridRefence);
                  }}
                  isUser={
                    profile?.user_metadata.username === pathname.split("/")[1]
                  }
                />
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}
