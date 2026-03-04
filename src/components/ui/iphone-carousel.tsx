import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Eye, ArrowRight } from "lucide-react";

interface HighlightSlide {
  id: number;
  textLists: string[];
  video: string;
  videoDuration: number;
}

interface VideoState {
  isEnd: boolean;
  startPlay: boolean;
  videoId: number;
  isLastVideo: boolean;
  isPlaying: boolean;
}

type ProcessType = "video-end" | "video-last" | "video-reset" | "pause" | "play";

export const hightlightsSlides: HighlightSlide[] = [
  {
    id: 1,
    textLists: [
      "Премиальный дизайн.",
      "iOS-стиль интерфейса.",
      "Мгновенный запуск.",
    ],
    video:
      "https://res.cloudinary.com/ds3yn5l5e/video/upload/v1769010712/highlight-first_dukqys.mp4",
    videoDuration: 4,
  },
  {
    id: 2,
    textLists: ["Telegram Mini App.", "Без скачивания. Без комиссий."],
    video:
      "https://res.cloudinary.com/ds3yn5l5e/video/upload/v1769010712/hightlight-third_xquibo.mp4",
    videoDuration: 5,
  },
  {
    id: 3,
    textLists: [
      "Встроенные платежи.",
      "Stripe, ЮKassa, СБП.",
      "Всё из коробки.",
    ],
    video:
      "https://res.cloudinary.com/ds3yn5l5e/video/upload/v1769010700/hightlight-sec_qtf7tq.mp4",
    videoDuration: 2,
  },
  {
    id: 4,
    textLists: ["AI-бот поддержки.", "24/7 на 150+ языках."],
    video:
      "https://res.cloudinary.com/ds3yn5l5e/video/upload/v1769010704/hightlight-fourth_iooitu.mp4",
    videoDuration: 3.6,
  },
];

export const VideoCarousel = () => {
    const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
    const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
    const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);

    const [video, setVideo] = useState<VideoState>({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });

    const [loadedData, setLoadedData] = useState<Event[]>([]);
    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

    useGSAP(() => {
        gsap.to("#slider", {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: "power2.inOut",
        });

        gsap.to("#video", {
            scrollTrigger: {
                trigger: "#video",
                toggleActions: "restart none none none",
            },
            onComplete: () => {
                setVideo((pre) => ({
                    ...pre,
                    startPlay: true,
                    isPlaying: true,
                }));
            },
        });
    }, [isEnd, videoId]);

    useEffect(() => {
        let currentProgress = 0;
        const span = videoSpanRef.current;

        if (span[videoId]) {
            const anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100);

                    if (progress != currentProgress) {
                        currentProgress = progress;

                        gsap.to(videoDivRef.current[videoId], {
                            width:
                                window.innerWidth < 760
                                    ? "10vw"
                                    : window.innerWidth < 1200
                                        ? "10vw"
                                        : "4vw",
                        });

                        gsap.to(span[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: "#10B981",
                        });
                    }
                },

                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: "12px",
                        });
                        gsap.to(span[videoId], {
                            backgroundColor: "#afafaf",
                        });
                    }
                },
            });

            if (videoId == 0) {
                anim.restart();
            }

            const animUpdate = () => {
                const currentVideo = videoRef.current[videoId];
                if (currentVideo) {
                    anim.progress(
                        currentVideo.currentTime /
                        hightlightsSlides[videoId].videoDuration
                    );
                }
            };

            if (isPlaying) {
                gsap.ticker.add(animUpdate);
            } else {
                gsap.ticker.remove(animUpdate);
            }
        }
    }, [videoId, startPlay]);

    useEffect(() => {
        if (loadedData.length > 3) {
            const currentVideo = videoRef.current[videoId];
            if (currentVideo) {
                if (!isPlaying) {
                    currentVideo.pause();
                } else {
                    startPlay && currentVideo.play();
                }
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData]);

    const handleProcess = (type: ProcessType, i?: number) => {
        switch (type) {
            case "video-end":
                setVideo((pre) => ({ ...pre, isEnd: true, videoId: i! + 1 }));
                break;

            case "video-last":
                setVideo((pre) => ({ ...pre, isLastVideo: true }));
                break;

            case "video-reset":
                setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
                break;

            case "pause":
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
                break;

            case "play":
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
                break;

            default:
                return video;
        }
    };

    const handleLoadedMetaData = (_i: number, e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        setLoadedData((pre) => [...pre, e.nativeEvent]);
    };

    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id="slider" className="pr-5 sm:pr-10 md:pr-20">
                        <div className="relative w-[85vw] sm:w-[70vw] h-[40vh] sm:h-[50vh] md:h-[70vh]">
                            <div className="w-full h-full flex items-center justify-center rounded-2xl sm:rounded-3xl overflow-hidden bg-black">
                                <video
                                    id="video"
                                    playsInline={true}
                                    className={`${list.id === 2 ? "translate-x-20 sm:translate-x-44" : ""} pointer-events-none w-full h-full object-cover`}
                                    preload="metadata"
                                    muted
                                    crossOrigin="anonymous"
                                    ref={(el) => {
                                        videoRef.current[i] = el;
                                    }}
                                    onEnded={() =>
                                        i !== 3
                                            ? handleProcess("video-end", i)
                                            : handleProcess("video-last")
                                    }
                                    onPlay={() =>
                                        setVideo((pre) => ({ ...pre, isPlaying: true }))
                                    }
                                    onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                                >
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div>

                            <div className="absolute top-6 sm:top-12 left-[5%] z-10">
                                {list.textLists.map((text, i) => (
                                    <p key={i} className="text-sm sm:text-xl font-medium text-white">
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative flex items-center justify-center mt-6 sm:mt-10">
                <div className="flex items-center justify-center py-3 px-5 sm:py-5 sm:px-7 bg-input backdrop-blur rounded-full">
                    {videoRef.current.map((_, i) => (
                        <span
                            key={i}
                            className="mx-1.5 sm:mx-2 w-3 h-3 bg-muted-foreground/30 rounded-full relative cursor-pointer"
                            ref={(el) => {
                                videoDivRef.current[i] = el;
                            }}
                        >
                            <span
                                className="absolute h-full w-full rounded-full"
                                ref={(el) => {
                                    videoSpanRef.current[i] = el;
                                }}
                            />
                        </span>
                    ))}
                </div>

                <button
                    className="ml-3 sm:ml-4 p-3 sm:p-4 rounded-full bg-input backdrop-blur flex items-center justify-center min-w-[44px] min-h-[44px] active:bg-white/20 transition-colors"
                    onClick={
                        isLastVideo
                            ? () => handleProcess("video-reset")
                            : !isPlaying
                                ? () => handleProcess("play")
                                : () => handleProcess("pause")
                    }
                >
                    {isLastVideo ? (
                        <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                    ) : !isPlaying ? (
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                    ) : (
                        <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                    )}
                </button>

            </div>
        </>
    );
};

export const IphoneCarousel = () => {
    useGSAP(() => {
        gsap.to('#title', { opacity: 1, y: 0 });
        gsap.to('.link', { opacity: 1, y: 0, duration: 1, stagger: 0.25 });
    }, []);

    return (
        <section id='highlights' className='w-full overflow-x-hidden py-12 sm:py-20 md:py-32 px-4 sm:px-10 bg-background min-h-[100svh]'>
            <div className='max-w-[1120px] mx-auto relative overflow-hidden'>
                <div className='mb-8 sm:mb-12 w-full md:flex items-end justify-between'>
                    <h1 id='title' className='text-foreground text-2xl sm:text-3xl md:text-5xl lg:text-6xl lg:mb-0 mb-4 sm:mb-5 font-medium opacity-0 translate-y-20 font-instrument-serif'>
                        Наши работы.
                    </h1>

                    <div className="flex flex-wrap items-end gap-3 sm:gap-5">
                        <a href="https://t.me/w4tg_bot/w4tg" target="_blank" rel="noopener noreferrer" className='link text-[#10B981] hover:underline cursor-pointer flex items-center text-base sm:text-xl opacity-0 translate-y-20 font-sans'>
                            Смотреть демо
                            <Eye className='ml-2 w-4 h-4 sm:w-5 sm:h-5' />
                        </a>
                        <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className='link text-[#10B981] hover:underline cursor-pointer flex items-center text-base sm:text-xl opacity-0 translate-y-20 font-sans'>
                            Все проекты
                            <ArrowRight className='ml-2 w-4 h-4 sm:w-5 sm:h-5' />
                        </a>
                    </div>
                </div>

                <VideoCarousel />
            </div>
        </section>
    );
};
