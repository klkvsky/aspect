"use client";

import clsx from "clsx";

import { Video } from "@/interfaces/video";

import { useSupabase } from "./supabase-provider";

import { IncreaseSizeOfCard, DecreaseSizeOfCard } from "@/lib/videoUtils";

import Muuri from "@/lib/localMuuri";

import { useCallback, useEffect, useState } from "react";

import VideoCard from "@/components/VIdeoCard";

export default function MainPage() {
  const { supabase } = useSupabase();

  const [gridRefence, setGridRefence] = useState<any>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  const [videoInFullscreen, setVideoInFullscreen] = useState<number>(-1);

  const fetchVideos = useCallback(async () => {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .range(0, 100);

    if (error) {
      console.log(error);
    } else {
      const orderedVideos = data.sort((a, b) => {
        return a.added_at - b.added_at;
      });
      setVideos(orderedVideos as unknown as Video[]);
    }
  }, [supabase]);

  useEffect(() => {
    if (videos.length !== 0) {
      if (!Muuri) return;
      const grid = new Muuri(".gridMuui", {
        items: ".item",
        layout: {
          fillGaps: true,
          rounding: true,
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
    }
  }, [fetchVideos, videos]);

  function onOpenInFullscreen(index: number) {
    if (!videoInFullscreen || videoInFullscreen === -1) {
      console.log("index in function: ", index);
      setVideoInFullscreen(index);
    } else {
      setVideoInFullscreen(-1);
    }
  }

  // function switchFullscreenVideoNext() {
  //   if (videoInFullscreen === -1) return;
  //   if (videoInFullscreen === videos.length) {
  //     setVideoInFullscreen(1);
  //   } else {
  //     setVideoInFullscreen(videoInFullscreen + 1);
  //   }
  // }

  // function switchFullscreenVideoPrevious() {
  //   if (videoInFullscreen === -1) return;
  //   if (videoInFullscreen === 1) {
  //     setVideoInFullscreen(videos.length);
  //   } else {
  //     setVideoInFullscreen(videoInFullscreen - 1);
  //   }
  // }

  // useEffect(() => {
  //   if (videoInFullscreen !== -1) {
  //     document.addEventListener("keydown", (e) => {
  //       if (e.key === "ArrowRight") {
  //         switchFullscreenVideoNext();
  //       } else if (e.key === "ArrowLeft") {
  //         switchFullscreenVideoPrevious();
  //       }
  //     });
  //   }
  // }, [videoInFullscreen]);

  return (
    <main className="mt-6 pb-24 w-full md:px-6">
      <div
        className={clsx(
          "fixed top-0 left-0 w-screen !z-[888] h-screen bg-black/50 backdrop-blur-lg transition-all ease-in-out duration-300",
          videoInFullscreen !== -1
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />
      <div className="gridMuui">
        {videos.map((video: any, index: number) => (
          <div
            key={index}
            className={clsx(
              "item relative",
              videoInFullscreen - 1 === index && "!z-[999]"
            )}
            data-name={video.id}
            id={`item-${index}`}
          >
            <div
              className="item-content px-[4px] py-[4px] lg:p-[10px] w-full h-full relative z-10"
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
              {videoInFullscreen === -1 && (
                <div className="absolute top-[11px] left-[11px] w-[calc(100%-22px)] h-[calc(100%-22px)] rounded-[14px] bg-neutral-900 animate-pulse hidden" />
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
                isUser={false}
                onOpenInFullscreen={() => {
                  onOpenInFullscreen(index + 1);
                }}
                onDelete={() => {}}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
