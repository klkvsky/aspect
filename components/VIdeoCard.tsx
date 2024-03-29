"use client";

import { Video } from "@/interfaces/video";

import { useSupabase } from "@/app/supabase-provider";
import { usePathname } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

import { useState, useEffect, useRef } from "react";

import {
  ArrowsPointingOutIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function VideoCard(props: {
  videoMetaData: Video;
  onLoad: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  isUser: boolean;
  onOpenInFullscreen: () => void;
  onDelete: () => void;
}) {
  const {
    videoMetaData,
    onLoad,
    onDecrease,
    onIncrease,
    isUser,
    onOpenInFullscreen,
    onDelete,
  } = props;

  const pathname = usePathname();
  const { supabase } = useSupabase();
  const [authorImage, setAuthorImage] = useState<string>();

  const videoRef = useRef<HTMLVideoElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);

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
    fetchAuthorImage();

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

  const fetchAuthorImage = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("username", videoMetaData.author);

    if (error) {
      console.log(error);
    } else {
      setAuthorImage(data[0].avatar_url);
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        onOpenInFullscreen();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, onOpenInFullscreen]);

  return (
    <div
      className={clsx(
        "relative group rounded-[6px] lg:rounded-[10px] transition-all ease-in-out group/main w-full cursor-pointer"
        // !isFullscreen && "hover:scale-[1.04]"
      )}
      tabIndex={1}
      onFocus={() => {
        setIsHovered(true);
        setIsMuted(false);
      }}
      onBlur={() => {
        setIsHovered(false);
        setIsMuted(true);
      }}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {/* <VideoJS options={videoJsOptions} onReady={handlePlayerReady} /> */}

      <video
        ref={videoRef}
        loop={true}
        muted={!isFullscreen && !isMuted}
        controls={false}
        playsInline={true}
        className={clsx(
          "transition-all ease-in-out max-w-[95vw] relative origin-center rounded-[6px] lg:rounded-[10px] select-none outline-none",
          isLoaded && "border border-transparent md:border-[#232323]",
          !isFullscreen &&
            "opacity-80 group-hover/main:opacity-100"
        )}
        style={{
          transform: isFullscreen ? `translate(${centerPosition})` : '',
          width: isFullscreen ? newDimensions.width : "100%",
          height: isFullscreen ? newDimensions.height : "100%",
        }}
        onLoadedMetadata={(elem) => {
          onLoad();
          if (videoRef.current && window.innerWidth < 768) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();

            setTimeout(() => {
              if (!videoRef.current) return;
              videoRef.current.pause();
            }, 100);
          }
        }}
        onLoadedData={(elem) => {
          setIsLoaded(true);
        }}
        onClick={() => {
          setIsFullscreen(!isFullscreen);
          onOpenInFullscreen();
        }}
      >
        <source src={videoMetaData.url} className="z-0 relative" />
        <track kind="captions" />
      </video>

      <div
        className={clsx(
          "absolute bottom-0 left-0 z-10 transition-all ease-in-out duration-200",
          !isLoaded && "opacity-0"
        )}
        style={{
          transform: isFullscreen ? `translate(${centerPosition})` : "",
          width: isFullscreen ? newDimensions.width : "100%",
          height: "26px",
        }}
      >
        <button
          className="w-[26px] h-[26px] aspect-square rounded-full bg-neutral-950/50 backdrop-blur-sm hover:border-opacity-50 p-1.5 hover:!scale-[1.04] active:!scale-[0.96] transition-all ease-in-out opacity-0 group-hover:opacity-50 hover:!opacity-100 place-items-center ml-auto absolute top-2 right-2 hidden"
          tabIndex={-1}
          onClick={() => {
            setIsFullscreen(!isFullscreen);
            onOpenInFullscreen();
          }}
        >
          <ArrowsPointingOutIcon className="w-full h-auto aspect-square text-white transition-all ease-in-out scale-75 group-hover:scale-100 duration-200 z-50" />
        </button>

        {isUser && (
          <button
            className="w-[26px] h-[26px] aspect-square rounded-full bg-neutral-950/50 backdrop-blur-sm hover:border-opacity-50 p-1.5 hover:!scale-[1.04] active:!scale-[0.96] transition-all ease-in-out opacity-0 group-hover:opacity-50 hover:!opacity-100 grid place-items-center ml-auto absolute top-2 left-2"
            onClick={() => {
              onDelete();
            }}
          >
            <TrashIcon className="w-full h-auto aspect-square text-red-500 transition-all ease-in-out scale-75 group-hover:scale-125 duration-200" />
          </button>
        )}

        <div className="absolute bottom-2 left-2">
          {isUser ? (
            <div className="flex flex-row items-center gap-2">
              <button
                className="w-[26px] h-[26px] aspect-square rounded-full bg-neutral-950/50 backdrop-blur-sm border border-neutral-700 hover:border-opacity-50 p-1 hover:!scale-[1.04] active:!scale-[0.96] opacity-0 group-hover:opacity-50 hover:!opacity-100 grid place-items-center transition-all ease-in-out"
                onClick={() => {
                  onIncrease();
                }}
              >
                <PlusIcon className="w-full h-auto aspect-square text-white transition-all ease-in-out scale-75 group-hover:scale-100 duration-200" />
              </button>

              <button
                className="w-[26px] h-[26px] aspect-square rounded-full bg-neutral-950/50 backdrop-blur-sm border border-neutral-700 hover:border-opacity-50 p-1 hover:!scale-[1.04] active:!scale-[0.96] opacity-0 group-hover:opacity-50 hover:!opacity-100 grid place-items-center transition-all ease-in-out"
                onClick={() => {
                  onDecrease();
                }}
              >
                <MinusIcon className="w-full h-auto aspect-square text-white transition-all ease-in-out scale-75 group-hover:scale-100 duration-200" />
              </button>
            </div>
          ) : pathname !== "/" ? (
            <div className="opacity-0" />
          ) : (
            <Link
              href={`/${videoMetaData.author}`}
              className="flex flex-row items-center gap-[2px] lg:gap-[4px] relative p-1 pr-2 hover:!scale-[1.04] active:!scale-[0.96] transition-all ease-in-out w-fit group-hover:opacity-50 hover:!opacity-100 group/avatar"
              tabIndex={-1}
            >
              <div className="rounded-full bg-neutral-950/50 backdrop-blur-sm border border-neutral-800 absolute top-0 left-0 w-full group-hover:w-[26px] group-hover:h-[26px] group-hover:translate-y-[1px] h-full transition-all ease-in-out duration-300 z-0 group-hover/avatar:!w-full" />

              {authorImage ? (
                <Image
                  src={authorImage}
                  width={18}
                  height={18}
                  alt="Profile picture of Me"
                  className="object-cover rounded-full overflow-hidden aspect-square z-10 scale-75 md:scale-100"
                />
              ) : (
                <div className="w-[18px] h-[18px] aspect-square rounded-full z-10 bg-neutral-700 animate-pulse scale-75 md:scale-100" />
              )}

              <span className="text-xs md:text-sm font-semibold text-[#ffffff]/30 group-hover:opacity-0 group-hover:pointer-events-none z-10 group-hover:max-w-0 group-hover/avatar:!opacity-100 group-hover/avatar:pointer-events-auto group-hover/avatar:!max-w-full group-hover/avatar:text-white duration-300">
                {videoMetaData.author}
              </span>
            </Link>
          )}
        </div>
        <button
          className="w-[26px] h-[26px] aspect-square rounded-full bg-neutral-950/50 backdrop-blur-sm border border-neutral-700 hover:border-opacity-50 p-1.5 hover:!scale-[1.04] active:!scale-[0.96] opacity-0 group-hover:opacity-50 hover:!opacity-100 grid place-items-center transition-all ease-in-out absolute bottom-2 right-2"
          tabIndex={-1}
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
  );
}
