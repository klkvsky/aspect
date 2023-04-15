"use client";
import { Video } from "@/interfaces/video";

import { usePathname } from "next/navigation";
import Image from "next/image";

import { useState, useEffect, useRef } from "react";

import {
  ArrowsPointingOutIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";

export default function VideoCard(props: {
  videoMetaData: Video;
  onLoad: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  isUser: boolean;
}) {
  const { videoMetaData, onLoad, onDecrease, onIncrease, isUser } = props;

  const pathname = usePathname();

  const videoURL = `${
    process.env.NEXT_PUBLIC_SUPABASE_URL
  }/storage/v1/object/public/videos/${pathname.split("/")[1]}/${
    videoMetaData.name
  }`;

  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newDimensions, setNewDimensions] = useState({
    width: "",
    height: "",
  });

  const [centerPosition, setCenterPosition] = useState("0px,0px");

  function centerElement(elem: HTMLElement) {
    const elemRect = elem.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newElemHeight = viewportHeight * 0.9;
    let newElemWidth = newElemHeight * (elemRect.width / elemRect.height);

    // Ensure the width doesn't exceed 95% of the window width
    const maxWidth = viewportWidth * 0.95;
    if (newElemWidth > maxWidth) {
      newElemWidth = maxWidth;
      // Update the height based on the new width
      const newHeight = newElemWidth * (elemRect.height / elemRect.width);
      newElemHeight = newHeight;
    }

    // Convert pixel dimensions to viewport units
    const newElemWidthVW = (newElemWidth / viewportWidth) * 100;
    const newElemHeightVH = (newElemHeight / viewportHeight) * 100;

    setNewDimensions({
      width: newElemWidthVW + "vw",
      height: newElemHeightVH + "vh",
    });

    const offsetX = (viewportWidth - newElemWidth) / 2;
    const offsetY = (viewportHeight - newElemHeight) / 2;

    const transformX = offsetX - elemRect.left;
    const transformY = offsetY - elemRect.top - 20;

    // Convert pixel values to viewport units
    const transformXVW = (transformX / viewportWidth) * 100;
    const transformYVH = (transformY / viewportHeight) * 100;

    setCenterPosition(`${transformXVW}vw,${transformYVH}vh`);
  }

  useEffect(() => {
    if (isFullscreen) {
      toggleScroll(true);
      centerElement(videoRef.current!);
      setIsMuted(false);
      setIsHovered(true);
    } else {
      toggleScroll(false);
      setIsMuted(true);
      setIsHovered(false);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;
    if (!video.HAVE_METADATA) return;

    if (isHovered) {
      video.play();
    } else {
      video.pause();
    }

    return () => {
      video.pause();
    };
  }, [isHovered, videoRef]);

  function toggleScroll(isDisabled?: boolean) {
    if (isDisabled) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }

  return (
    <div
      className="w-full relative group rounded-[6px] hover:border-opacity-50 transition-all ease-in-out group/main z-[999]"
      onClick={() => {
        setIsMuted(!isMuted);
      }}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <video
        ref={videoRef}
        loop={true}
        muted={isMuted}
        className="transition-all max-w-[95vw] relative origin-center rounded-[6px] select-none outline-none w-full h-auto"
        style={{
          transform: isFullscreen ? `translate(${centerPosition})` : "",
          width: isFullscreen ? newDimensions.width : "100%",
          height: isFullscreen ? newDimensions.height : "100%",
        }}
        onLoadedMetadata={() => {
          onLoad();
        }}
      >
        <source src={videoURL} />
        <track kind="captions" />
      </video>

      <div
        className="absolute top-0 left-0 z-10 rounded-[6px] flex flex-col justify-between origin-center transition-all ease-in-out p-1 border border-[#363636]"
        style={{
          transform: isFullscreen ? `translate(${centerPosition})` : "",
          width: isFullscreen ? newDimensions.width : "100%",
          height: isFullscreen ? newDimensions.height : "100%",
        }}
      >
        <button
          className="w-[26px] h-[26px] aspect-square rounded-full bg-neutral-950/50 backdrop-blur-sm border border-neutral-700 hover:border-opacity-50 p-1.5 hover:!scale-[1.04] active:!scale-[0.96] transition-all ease-in-out opacity-0 group-hover:opacity-50 hover:!opacity-100 grid place-items-center ml-auto hidden"
          onClick={() => {
            setIsFullscreen(!isFullscreen);
          }}
        >
          <ArrowsPointingOutIcon className="w-full h-auto aspect-square text-white transition-all ease-in-out scale-75 group-hover:scale-100 duration-200" />
        </button>

        <div className="mt-auto flex flex-row items-center justify-between w-full hidden">
          {isUser ? (
            <div className="flex flex-row items-center gap-2">
              <button
                className="w-[26px] h-[26px] aspect-square rounded-full bg-neutral-950/50 backdrop-blur-sm border border-neutral-700 hover:border-opacity-50 p-1.5 hover:!scale-[1.04] active:!scale-[0.96] opacity-0 group-hover:opacity-50 hover:!opacity-100 grid place-items-center transition-all ease-in-out"
                onClick={() => {
                  onIncrease();
                }}
              >
                <ArrowsPointingOutIcon className="w-full h-auto aspect-square text-white transition-all ease-in-out scale-75 group-hover:scale-100 duration-200" />
              </button>

              <button
                className="w-[26px] h-[26px] aspect-square rounded-full bg-neutral-950/50 backdrop-blur-sm border border-neutral-700 hover:border-opacity-50 p-1.5 hover:!scale-[1.04] active:!scale-[0.96] opacity-0 group-hover:opacity-50 hover:!opacity-100 grid place-items-center transition-all ease-in-out"
                onClick={() => {
                  onDecrease();
                }}
              >
                <ArrowsPointingInIcon className="w-full h-auto aspect-square text-white transition-all ease-in-out scale-75 group-hover:scale-100 duration-200" />
              </button>
            </div>
          ) : pathname !== "/" ? (
            <div className="opacity-0" />
          ) : (
            <button className="flex flex-row items-center gap-[4px] relative p-1 pr-2 hover:!scale-[1.04] active:!scale-[0.96] transition-all ease-in-out w-fit group-hover:opacity-50 hover:!opacity-100 group/avatar">
              <div className="rounded-full bg-neutral-950/50 backdrop-blur-sm border border-neutral-700 absolute top-0 left-0 w-full group-hover:w-[26px] group-hover:h-[26px] group-hover:translate-y-[1px] h-full transition-all ease-in-out duration-300 z-0 group-hover/avatar:!w-full" />

              <Image
                src="https://zqjvsefawyzwxbridxjw.supabase.co/storage/v1/object/public/videos/avatars/avatar.png"
                width={18}
                height={18}
                alt="Profile picture of Me"
                className="object-cover rounded-full overflow-hidden aspect-square z-10"
              />

              <span className="text-sm font-semibold text-white/50 group-hover:opacity-0 group-hover:pointer-events-none z-10 group-hover:max-w-0 group-hover/avatar:!opacity-100 group-hover/avatar:pointer-events-auto group-hover/avatar:!max-w-full group-hover/avatar:text-white duration-300 capitalize">
                {pathname.split("/")[1]}
              </span>
            </button>
          )}

          <button
            className="w-[26px] h-[26px] aspect-square rounded-full bg-neutral-950/50 backdrop-blur-sm border border-neutral-700 hover:border-opacity-50 p-1.5 hover:!scale-[1.04] active:!scale-[0.96] opacity-0 group-hover:opacity-50 hover:!opacity-100 grid place-items-center transition-all ease-in-out hidden"
            onClick={() => {
              setIsMuted(!isMuted);
            }}
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="w-full h-auto aspect-square text-white transition-all ease-in-out scale-75 group-hover:scale-100 duration-200" />
            ) : (
              <SpeakerWaveIcon className="w-full h-auto aspect-square text-white transition-all ease-in-out scale-75 group-hover:scale-100 duration-200" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
