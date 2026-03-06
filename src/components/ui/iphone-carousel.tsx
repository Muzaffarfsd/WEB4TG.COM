import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, ArrowUpRight } from "lucide-react";

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
    textLists: ["Telegram Mini App.", "Без скачивания.", "Без комиссий."],
    video:
      "https://res.cloudinary.com/ds3yn5l5e/video/upload/v1769010712/hightlight-third_xquibo.mp4",
    videoDuration: 5,
  },
  {
    id: 3,
    textLists: [
      "Встроенные платежи.",
      "Stripe, ЮKassa, СБП.",
    ],
    video:
      "https://res.cloudinary.com/ds3yn5l5e/video/upload/v1769010700/hightlight-sec_qtf7tq.mp4",
    videoDuration: 2,
  },
  {
    id: 4,
    textLists: ["AI-бот поддержки.", "150+ языков. 24/7."],
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
    const [videoErrors, setVideoErrors] = useState<Set<number>>(new Set());
    const [videoLoading, setVideoLoading] = useState<Set<number>>(new Set([0, 1, 2, 3]));
    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

    const handleVideoError = (index: number) => {
        setVideoErrors((prev) => new Set(prev).add(index));
    };

    useGSAP(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        gsap.to("#slider", {
            transform: `translateX(${-100 * videoId}%)`,
            duration: prefersReduced ? 0 : 2,
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
        let animUpdateFn: (() => void) | null = null;

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
                            backgroundColor: "#8B5CF6",
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

            animUpdateFn = () => {
                const currentVideo = videoRef.current[videoId];
                if (currentVideo) {
                    anim.progress(
                        currentVideo.currentTime /
                        hightlightsSlides[videoId].videoDuration
                    );
                }
            };

            if (isPlaying) {
                gsap.ticker.add(animUpdateFn);
            }
        }

        return () => {
            if (animUpdateFn) gsap.ticker.remove(animUpdateFn);
        };
    }, [videoId, startPlay, isPlaying]);

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
            case "play":
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
                break;
            default:
                return video;
        }
    };

    const handleLoadedMetaData = (i: number, e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        setLoadedData((pre) => [...pre, e.nativeEvent]);
        setVideoLoading((prev) => {
            const next = new Set(prev);
            next.delete(i);
            return next;
        });
    };

    return (
        <>
            <div className="flex items-center" aria-live="polite">
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id="slider" className="pr-5 sm:pr-10 md:pr-20" role="group" aria-roledescription="slide" aria-label={`Слайд ${i + 1} из ${hightlightsSlides.length}: ${list.textLists[0]}`}>
                        <div className="relative w-[85vw] sm:w-[70vw] h-[45vh] sm:h-[55vh] md:h-[70vh]">
                            <div className="w-full h-full flex items-center justify-center rounded-2xl sm:rounded-3xl overflow-hidden bg-black/50 border border-white/[0.04] relative">
                                {videoLoading.has(i) && !videoErrors.has(i) && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0a10]">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-[#8B5CF6] animate-spin" />
                                            <span className="text-[11px] text-white/60 font-sans uppercase tracking-wider">
                                                {list.textLists[0]}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {videoErrors.has(i) ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] relative">
                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.15)_0%,_transparent_70%)]" />
                                        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mb-2">
                                                <Play className="w-5 h-5 text-white/60" />
                                            </div>
                                            {list.textLists.map((text, idx) => (
                                                <p key={idx} className="text-sm sm:text-lg md:text-xl font-medium text-white/70 font-sans tracking-tight leading-snug">
                                                    {text}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <video
                                        id="video"
                                        playsInline={true}
                                        className={`${list.id === 2 ? "translate-x-20 sm:translate-x-44" : ""} pointer-events-none w-full h-full object-cover`}
                                        preload="metadata"
                                        muted
                                        crossOrigin="anonymous"
                                        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect fill='%230a0a10' width='1' height='1'/%3E%3C/svg%3E"
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
                                        onError={() => handleVideoError(i)}
                                    >
                                        <source src={list.video} type="video/mp4" onError={() => handleVideoError(i)} />
                                    </video>
                                )}
                            </div>

                            <div className="absolute top-6 sm:top-10 left-6 sm:left-10 z-10">
                                {list.textLists.map((text, idx) => (
                                    <p key={idx} className="text-sm sm:text-lg md:text-xl font-medium text-white/90 font-sans tracking-tight leading-snug">
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative flex items-center justify-center mt-8 sm:mt-12">
                <div className="flex items-center justify-center py-3 px-5 sm:py-4 sm:px-6 bg-[#0a0a10]/80 rounded-full border border-white/[0.06]">
                    {videoRef.current.map((_, i) => (
                        <span
                            key={i}
                            className="mx-1.5 sm:mx-2 w-3 h-3 bg-white/10 rounded-full relative cursor-pointer"
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
                    aria-label={isLastVideo ? 'Перезапустить' : !isPlaying ? 'Воспроизвести' : 'Пауза'}
                    className="ml-3 sm:ml-4 p-3 sm:p-3.5 rounded-full bg-[#0a0a10]/80 border border-white/[0.06] flex items-center justify-center min-w-[44px] min-h-[44px] hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors duration-300"
                    onClick={
                        isLastVideo
                            ? () => handleProcess("video-reset")
                            : !isPlaying
                                ? () => handleProcess("play")
                                : () => handleProcess("pause")
                    }
                >
                    {isLastVideo ? (
                        <RotateCcw className="w-5 h-5 text-white/70" />
                    ) : !isPlaying ? (
                        <Play className="w-5 h-5 text-white/70" />
                    ) : (
                        <Pause className="w-5 h-5 text-white/70" />
                    )}
                </button>
            </div>
        </>
    );
};

export const IphoneCarousel = () => {
    useGSAP(() => {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            gsap.set('#carousel-title', { opacity: 1, y: 0 });
            gsap.set('.carousel-link', { opacity: 1, y: 0 });
            return;
        }
        gsap.to('#carousel-title', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: '#carousel-title', start: 'top 85%', once: true }
        });
        gsap.to('.carousel-link', { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: '#carousel-title', start: 'top 85%', once: true }
        });
    }, []);

    return (
        <section id='highlights' className='relative w-full overflow-x-hidden py-20 sm:py-28 md:py-36 px-5 sm:px-8' role="group" aria-roledescription="carousel" aria-label="Портфолио видео">
            <div className='max-w-[1120px] mx-auto relative overflow-hidden'>
                <div className='mb-8 sm:mb-14 w-full md:flex items-end justify-between'>
                    <div>
                        <span className="section-label opacity-0 translate-y-5 carousel-link">
                            <span className="w-8 h-px bg-[#8B5CF6]/40 mr-3" />
                            Портфолио
                        </span>
                        <h2 id='carousel-title' className='text-[clamp(1.75rem,4.5vw,3.5rem)] lg:mb-0 mb-4 font-normal opacity-0 translate-y-10 font-instrument-serif gradient-text-white tracking-[-0.02em] leading-[1.1]'>
                            Наши работы
                        </h2>
                    </div>

                    <div className="flex items-end gap-4 sm:gap-6">
                        <a href="https://t.me/w4tg_bot/w4tg" target="_blank" rel="noopener noreferrer" className='carousel-link text-[12px] sm:text-[13px] text-white/70 hover:text-[#8B5CF6] flex items-center gap-1.5 opacity-0 translate-y-10 font-sans transition-colors duration-300'>
                            Демо
                            <ArrowUpRight className='w-3.5 h-3.5' />
                        </a>
                        <a href="https://t.me/w4tg_bot" target="_blank" rel="noopener noreferrer" className='carousel-link text-[12px] sm:text-[13px] text-white/70 hover:text-[#8B5CF6] flex items-center gap-1.5 opacity-0 translate-y-10 font-sans transition-colors duration-300'>
                            Все проекты
                            <ArrowUpRight className='w-3.5 h-3.5' />
                        </a>
                    </div>
                </div>

                <VideoCarousel />
            </div>
        </section>
    );
};
