"use client";
import Image from "next/image";
import { useState, useRef, useEffect, useLayoutEffect } from "react";

export default function NewVideoCard(props: {
  videoURL: string;
  author: string;
  authorImage: string;
  tags: string[];
  onFullscreen: () => void;
  onLoad: () => void;
}) {
  const { videoURL, author, authorImage, tags, onLoad } = props;
  const [rendered, setRendered] = useState<boolean>(false);
  //
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  //
  const [FullScreen, setFullScreen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  //
  const [centerPosition, setCenterPosition] = useState<string>("0px 0px");
  const [newDimensions, setNewDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  function centerElement(elem: HTMLElement) {
    const elemRect = elem.getBoundingClientRect();
    //
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    //
    const newElemHeight = viewportHeight * 0.9;
    const newElemWidth = newElemHeight * (elemRect.width / elemRect.height);
    //
    setNewDimensions({ width: newElemWidth, height: newElemHeight });
    //
    const offsetX = (viewportWidth - newElemWidth) / 2;
    const offsetY = (viewportHeight - newElemHeight) / 2;
    //
    const transformX = offsetX - elemRect.left;
    const transformY = offsetY - elemRect.top;

    setCenterPosition(`${transformX}px,${transformY}px`);
  }

  useEffect(() => {
    if (FullScreen) {
      centerElement(videoRef.current!);
      setIsMuted(false);
      setIsPlaying(true);
    } else {
      setIsMuted(true);
      setIsPlaying(false);
    }

    if (!rendered) {
      setRendered(true);
    } else {
      props.onFullscreen();
    }
  }, [FullScreen]);

  useEffect(() => {
    if (isPlaying) {
      if (videoRef.current) {
        videoRef.current.play();
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [isPlaying]);

  return (
    <div
      className={`w-full relative group rounded-[14px] border hover:border-opacity-50 ${
        FullScreen ? "border-transparent" : "border-[#363636]"
      }`}
      onClick={() => {
        setIsMuted(!isMuted);
      }}
    >
      <video
        ref={videoRef}
        loop={true}
        muted={isMuted}
        controls={FullScreen}
        autoPlay={isPlaying}
        className="transition-all max-w-[95vw] relative origin-center rounded-[14px] select-none outline-none"
        style={{
          transform: FullScreen ? `translate(${centerPosition})` : "",
          width: FullScreen ? newDimensions.width : "100%",
          height: FullScreen ? newDimensions.height : "100%",
          zIndex: FullScreen ? 999 : 1,
          opacity: isPlaying ? 1 : 0.6,
        }}
        onLoadedMetadata={() => {
          onLoad();
        }}
      >
        <source src={videoURL} />
        <track kind="captions" />
      </video>

      <div
        className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-[10px] transition-all origin-center"
        style={{
          transform: FullScreen ? `translate(${centerPosition})` : "",
          width: FullScreen ? newDimensions.width : "100%",
          height: FullScreen ? newDimensions.height : "100%",
          zIndex: FullScreen ? 999 : 2,
        }}
        onMouseEnter={() => !FullScreen && setIsPlaying(true)}
        onMouseLeave={() => !FullScreen && setIsPlaying(false)}
      >
        <div
          className="flex flex-row items-center justify-between real
       z-10 w-full"
        >
          <div
            className={`flex flex-row items-center gap-1 w-full flex-wrap text-xs  opacity-0 ${
              FullScreen
                ? ""
                : "transition-all ease-in-out group-hover:text-[8px] hover:!text-xs duration-[25ms]"
            }`}
          >
            {tags.map((tag) => {
              return (
                <p
                  key={tag}
                  className={`bg-black/50 backdrop-blur-md px-2 py-1.5 font-medium rounded-[12px] transition-all duration-300 ease-in-out hover:!bg-black/80 hover:!px-2 hover:!py-1.5 cursor-pointer ${
                    FullScreen
                      ? "bg-black/10 group-hover:bg-black/50"
                      : "group-hover:bg-black/10 group-hover:px-1 group-hover:py-0.5"
                  }`}
                >
                  {tag}
                </p>
              );
            })}
          </div>

          <button
            className="grid place-items-center w-7 h-7 aspect-square rounded-full bg-black/50 backdrop-blur-md opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-all duration-300 ease-in-out –translate-y-2 group-hover:-translate-y-0.5 cursor-pointer hover:!scale-[1.3] border border-transparent hover:!border-[#363636]"
            onClick={() => {
              setFullScreen(!FullScreen);
              centerElement(videoRef.current!);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-[12px] h-[12px]"
            >
              <path
                fillRule="evenodd"
                d="M15 3.75a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V5.56l-3.97 3.97a.75.75 0 11-1.06-1.06l3.97-3.97h-2.69a.75.75 0 01-.75-.75zm-12 0A.75.75 0 013.75 3h4.5a.75.75 0 010 1.5H5.56l3.97 3.97a.75.75 0 01-1.06 1.06L4.5 5.56v2.69a.75.75 0 01-1.5 0v-4.5zm11.47 11.78a.75.75 0 111.06-1.06l3.97 3.97v-2.69a.75.75 0 011.5 0v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 010-1.5h2.69l-3.97-3.97zm-4.94-1.06a.75.75 0 010 1.06L5.56 19.5h2.69a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 011.5 0v2.69l3.97-3.97a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-row items-center justify-between w-full mt-auto">
          <div
            className={`font-semibold relative z-30 flex flex-row items-center px-[12px] py-[6px] bg-black/50 backdrop-blur-[6px] rounded-[33px] border border-[#696969] self-start gap-[5px] text-[14px]  transition-all ease-in-out cursor-pointer ${
              FullScreen
                ? ""
                : "group-hover:scale-[0.8] group-hover:-translate-x-[13%] group-hover:translate-y-2 hover:!scale-100 hover:!translate-x-0 hover:!translate-y-0 group-hover:bg-black/10 hover:!bg-black/50 group-hover:border-opacity-50"
            }`}
          >
            <Image
              src={authorImage}
              width={14}
              height={14}
              alt="Profile picture of Me"
              className="object-cover z-0 rounded-[16px] overflow-hidden relative transition-all ease-in-out min-w-[14px] aspect-square"
              style={{
                filter:
                  ((videoURL === "/video4.mp4" || videoURL === "/video2.mp4") &&
                    "invert(1)") ||
                  "none",
              }}
            />
            <span>{author}</span>
            <svg
              width="16"
              height="14"
              viewBox="0 0 23 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-all ease-in-out"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.38608 3.48242C8.77288 3.03621 9.25116 2.67846 9.78846 2.43346C10.3258 2.18846 10.9095 2.06194 11.5 2.0625C12.7439 2.0625 13.8586 2.6125 14.6139 3.48242C15.2031 3.44035 15.7943 3.52558 16.3476 3.73231C16.9009 3.93903 17.4032 4.26242 17.8204 4.6805C18.2383 5.09764 18.5616 5.5998 18.7683 6.1529C18.975 6.706 19.0604 7.2971 19.0185 7.88608C19.4645 8.27297 19.8221 8.75129 20.067 9.28858C20.3118 9.82587 20.4382 10.4096 20.4375 11C20.4381 11.5905 20.3115 12.1742 20.0665 12.7115C19.8215 13.2488 19.4638 13.7271 19.0176 14.1139C19.0595 14.7029 18.9741 15.294 18.7674 15.8471C18.5607 16.4002 18.2374 16.9024 17.8195 17.3195C17.4024 17.7374 16.9002 18.0607 16.3471 18.2674C15.794 18.4741 15.2029 18.5595 14.6139 18.5176C14.2271 18.9638 13.7488 19.3215 13.2115 19.5665C12.6742 19.8115 12.0905 19.9381 11.5 19.9375C10.9095 19.9381 10.3258 19.8115 9.78846 19.5665C9.25116 19.3215 8.77288 18.9638 8.38608 18.5176C7.79701 18.5598 7.20576 18.4747 6.65249 18.2681C6.09921 18.0616 5.59687 17.7383 5.17958 17.3204C4.76155 16.9032 4.4382 16.4009 4.23147 15.8476C4.02475 15.2943 3.93949 14.7031 3.9815 14.1139C3.53546 13.727 3.17788 13.2487 2.93304 12.7114C2.6882 12.1741 2.56182 11.5905 2.5625 11C2.5625 9.75609 3.1125 8.64142 3.98242 7.88608C3.94048 7.2971 4.02578 6.70598 4.2325 6.15287C4.43922 5.59976 4.76254 5.09761 5.1805 4.6805C5.5976 4.26254 6.09976 3.93923 6.65287 3.7325C7.20598 3.52578 7.79709 3.44049 8.38608 3.48242ZM14.8092 9.33717C14.8642 9.26388 14.904 9.18034 14.9262 9.09145C14.9485 9.00257 14.9527 8.91013 14.9387 8.81958C14.9248 8.72902 14.8928 8.64217 14.8448 8.56414C14.7968 8.48611 14.7336 8.41846 14.6591 8.36518C14.5845 8.3119 14.5001 8.27406 14.4107 8.25388C14.3213 8.2337 14.2288 8.23159 14.1386 8.24768C14.0484 8.26376 13.9623 8.29772 13.8854 8.34755C13.8085 8.39737 13.7424 8.46207 13.6908 8.53784L10.7245 12.6903L9.23583 11.2017C9.1055 11.0802 8.93313 11.0141 8.75502 11.0173C8.57691 11.0204 8.40697 11.0926 8.28101 11.2185C8.15505 11.3445 8.0829 11.5144 8.07975 11.6925C8.07661 11.8706 8.14273 12.043 8.26417 12.1733L10.3267 14.2358C10.3972 14.3064 10.4823 14.3607 10.576 14.395C10.6697 14.4293 10.7697 14.4429 10.8691 14.4347C10.9685 14.4265 11.065 14.3968 11.1518 14.3475C11.2386 14.2983 11.3136 14.2308 11.3717 14.1497L14.8092 9.33717Z"
                fill="#1DA1F2"
              />
            </svg>
          </div>
          {!FullScreen && (
            <button
              className="grid place-items-center w-7 h-7 aspect-square rounded-full bg-black/50 backdrop-blur-md opacity-0 group-hover:opacity-50 transition-all duration-300 ease-in-out translate-y-2 group-hover:translate-y-2.5 hover:!opacity-100 cursor-pointer hover:!scale-[1.15] border border-transparent hover:!border-[#363636]"
              onClick={() => {
                setIsMuted(!isMuted);
              }}
            >
              {isMuted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[12px] h-[12px]"
                >
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[12px] h-[12px]"
                >
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                  <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
