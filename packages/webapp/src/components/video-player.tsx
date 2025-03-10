import * as FilledIcon from '@/assets/icons/filled'
import * as LineIcon from '@/assets/icons/line'
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from '@briefer/ui/slider'
import React from 'react'

export interface VideoChapter {
  title: string
  startTime: number
  endTime: number
}

export interface VideoPlayerRef {
  play: () => Promise<void>
  pause: () => void
  seek: (time: number) => void
  getCurrentTime: () => number
  getDuration: () => number
  playing: () => boolean
}

export function VideoPlayer({
  videoUrl,
  chapters = [],
  onTimeUpdate,
  initialTime = 0,
  autoPlay = false,
  ref,
}: {
  videoUrl: string
  chapters?: VideoChapter[]
  onTimeUpdate?: (currentTime: number) => void
  initialTime?: number
  autoPlay?: boolean
  ref?: React.RefObject<VideoPlayerRef | null>
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = React.useState(initialTime)
  const [duration, setDuration] = React.useState(0)
  const [playing, setPlaying] = React.useState(autoPlay)
  const [hoverTime, setHoverTime] = React.useState<number | null>(null)
  const [volume, setVolume] = React.useState(1)
  const [muted, setMuted] = React.useState(false)
  const [fullscreen, setFullscreen] = React.useState(false)
  const playerContainerRef = React.useRef<HTMLDivElement>(null)
  const [showControls, setShowControls] = React.useState(true)
  const controlsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Expose methods via ref
  React.useEffect(() => {
    if (!ref) return

    ref.current = {
      play: async () => {
        if (videoRef.current) {
          await videoRef.current.play()
          setPlaying(true)
        }
      },
      pause: () => {
        if (videoRef.current) {
          videoRef.current.pause()
          setPlaying(false)
        }
      },
      seek: (time: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, Math.min(time, duration))
          setCurrentTime(videoRef.current.currentTime)
        }
      },
      getCurrentTime: () => videoRef.current?.currentTime || 0,
      getDuration: () => duration,
      playing: () => playing,
    }
  }, [ref, duration, playing])

  // Handle video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime
      setCurrentTime(newTime)
      onTimeUpdate?.(newTime)
    }
  }

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      // Set initial time if provided
      if (initialTime > 0) {
        videoRef.current.currentTime = initialTime
        setCurrentTime(initialTime)
      }
    }
  }

  // Handle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch((err) => {
          console.error('Error playing video:', err)
        })
      }
      setPlaying(!playing)
    }
  }

  // Handle seeking
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
      const progressBar = e.currentTarget
      const rect = progressBar.getBoundingClientRect()
      const clickPosition = (e.clientX - rect.left) / rect.width
      const newTime = clickPosition * duration

      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  // Add mouse move handler for hover preview
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, chapter: VideoChapter) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const percentage = relativeX / rect.width
    const chapterDuration = chapter.endTime - chapter.startTime
    const previewTime = chapter.startTime + chapterDuration * percentage
    setHoverTime(previewTime)
  }

  const handleMouseLeave = () => {
    setHoverTime(null)
  }

  // Volume control
  const handleVolumeChange = (volume: number) => {
    setVolume(volume)
    if (videoRef.current) {
      videoRef.current.volume = volume
      setMuted(volume === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !muted
      videoRef.current.muted = newMutedState
      setMuted(newMutedState)
    }
  }

  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  // Auto-hide controls
  const showControlsTemporarily = () => {
    setShowControls(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (videoRef.current?.paused === false) {
        setShowControls(false)
      }
    }, 3000)
  }

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts if the video player is focused or no input element is focused
      // Skip handling if user is typing in an input field
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        (document.activeElement instanceof HTMLElement && document.activeElement.isContentEditable)
      ) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        showControlsTemporarily()
        togglePlayPause()
      } else if (e.code === 'ArrowRight') {
        if (videoRef.current) {
          showControlsTemporarily()
          videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 5, duration)
        }
      } else if (e.code === 'ArrowLeft') {
        if (videoRef.current) {
          showControlsTemporarily()
          videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 5, 0)
        }
      } else if (e.code === 'KeyM') {
        showControlsTemporarily()
        toggleMute()
      } else if (e.code === 'KeyF') {
        showControlsTemporarily()
        toggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [playing, duration])

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Auto-play if specified
  React.useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error('Failed to autoplay:', err)
      })
    }
  }, [autoPlay])

  return (
    <div
      ref={playerContainerRef}
      className="relative aspect-video overflow-hidden rounded-lg"
      onMouseMove={showControlsTemporarily}
      onClick={togglePlayPause}
    >
      <video
        ref={videoRef}
        className="size-full object-contain"
        src={videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        controls={false}
      />

      <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/70 to-transparent" />

      {/* Custom video controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-2 text-white transition-opacity duration-200 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar with chapters */}
        <div className="group relative cursor-pointer" onClick={handleSeek}>
          {/* Generate segments for both chapters and gaps */}
          {(() => {
            // Create segments array that includes both chapters and gaps
            const segments: Array<{
              isChapter: boolean
              startTime: number
              endTime: number
              title?: string
            }> = []

            // Sort chapters by start time
            const sortedChapters = [...chapters].sort((a, b) => a.startTime - b.startTime)

            // Add initial gap if first chapter doesn't start at 0
            if (sortedChapters.length === 0 || sortedChapters[0].startTime > 0) {
              segments.push({
                isChapter: false,
                startTime: 0,
                endTime: sortedChapters.length > 0 ? sortedChapters[0].startTime : duration,
              })
            }

            // Add chapters and gaps between them
            sortedChapters.forEach((chapter, index) => {
              // Add the chapter
              segments.push({
                isChapter: true,
                startTime: chapter.startTime,
                endTime: chapter.endTime,
                title: chapter.title,
              })

              // Add gap after this chapter if it's not the last one and there's a gap
              if (
                index < sortedChapters.length - 1 &&
                chapter.endTime < sortedChapters[index + 1].startTime
              ) {
                segments.push({
                  isChapter: false,
                  startTime: chapter.endTime,
                  endTime: sortedChapters[index + 1].startTime,
                })
              }
            })

            // Add final gap if last chapter doesn't end at duration
            if (
              sortedChapters.length > 0 &&
              sortedChapters[sortedChapters.length - 1].endTime < duration
            ) {
              segments.push({
                isChapter: false,
                startTime: sortedChapters[sortedChapters.length - 1].endTime,
                endTime: duration,
              })
            }

            return segments.map((segment, index) => {
              const isStarted = currentTime >= segment.startTime
              const segmentProgress = isStarted
                ? Math.min(currentTime - segment.startTime, segment.endTime - segment.startTime)
                : 0
              const segmentWidth = ((segment.endTime - segment.startTime) / duration) * 100
              const progressWidth = (segmentProgress / (segment.endTime - segment.startTime)) * 100

              return (
                <div
                  key={index}
                  className="absolute top-1/2 z-10 h-[3px] -translate-y-1/2 transition-all duration-200 hover:h-[7px] group-hover:h-[5px]"
                  style={{
                    left: `${(segment.startTime / duration) * 100}%`,
                    width: `calc(${segmentWidth}% - 2px)`,
                  }}
                  title={
                    segment.isChapter
                      ? segment.title || `Chapter ${index + 1}`
                      : 'Unlabeled section'
                  }
                  onMouseMove={(e) => handleMouseMove(e, segment as VideoChapter)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Background segment marker */}
                  <div
                    className={`absolute inset-0 rounded-sm ${segment.isChapter ? 'bg-accent-500/40' : 'bg-white/40'}`}
                  />

                  {/* Progress overlay */}
                  {isStarted && (
                    <div
                      className={`absolute inset-0 rounded-sm ${segment.isChapter ? 'bg-accent-600' : 'bg-white'}`}
                      style={{
                        width: `${progressWidth}%`,
                      }}
                    />
                  )}

                  {/* Hover preview overlay */}
                  {hoverTime !== null && (
                    <>
                      {/* For current or future segments being hovered */}
                      {hoverTime > currentTime &&
                        segment.startTime <= hoverTime &&
                        hoverTime <= segment.endTime && (
                          <div
                            className={`absolute inset-0 rounded-sm ${segment.isChapter ? 'bg-accent-600/40' : 'bg-white/40'}`}
                            style={{
                              left: isStarted ? `${progressWidth}%` : '0%',
                              width: `${((hoverTime - Math.max(currentTime, segment.startTime)) / (segment.endTime - segment.startTime)) * 100}%`,
                            }}
                          />
                        )}

                      {/* For previous segments when hovering a future segment */}
                      {hoverTime > segment.endTime && (
                        <div
                          className={`absolute inset-0 rounded-sm ${segment.isChapter ? 'bg-accent-600/40' : 'bg-white/40'}`}
                          style={{
                            width: '100%',
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              )
            })
          })()}
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <button className="cursor-pointer" onClick={togglePlayPause}>
              {playing ? (
                <FilledIcon.Pause className="size-5" />
              ) : (
                <FilledIcon.Play className="size-5" />
              )}
            </button>
            <div className="group relative flex items-center gap-2">
              <button className="cursor-pointer" onClick={toggleMute}>
                {muted ? (
                  <FilledIcon.VolumeOff className="size-5" />
                ) : volume > 0.5 ? (
                  <FilledIcon.VolumeHigh className="size-5" />
                ) : (
                  <FilledIcon.VolumeLow className="size-5" />
                )}
              </button>
              <Slider
                defaultValue={volume}
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onValueChange={(value: any) => {
                  handleVolumeChange(value)
                  showControlsTemporarily()
                }}
              >
                <SliderControl className="w-[52px]">
                  <SliderTrack className="bg-white/40">
                    <SliderIndicator className="bg-white" />
                    <SliderThumb />
                  </SliderTrack>
                </SliderControl>
              </Slider>
            </div>
            <span className="drop-shadow-xs text-xs">
              <span>{formatTime(currentTime)}</span>
              <span> / </span>
              <span>{formatTime(duration)}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen button */}
            <button className="cursor-pointer" onClick={toggleFullscreen}>
              {fullscreen ? (
                <LineIcon.Minimize className="size-5" />
              ) : (
                <LineIcon.Maximize className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
