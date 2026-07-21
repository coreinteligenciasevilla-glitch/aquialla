import React, { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  url: string;
  category: 'aqui' | 'alla' | 'both';
  isPlaying: boolean;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ url, category, isPlaying }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Helper to extract YouTube ID
  const getYoutubeId = (urlStr: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlStr.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYoutubeId(url);
  const isDirectVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);

  // Fallback video URLs from mixkit
  const fallbackVideoUrl = category === 'aqui'
    ? 'https://assets.mixkit.co/videos/preview/mixkit-yellow-and-gold-neon-light-lines-43029-large.mp4'
    : 'https://assets.mixkit.co/videos/preview/mixkit-red-neon-light-glowing-in-the-dark-43026-large.mp4';

  useEffect(() => {
    if (isDirectVideo || !youtubeId) {
      const video = videoRef.current;
      if (video) {
        if (isPlaying) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    } else if (youtubeId) {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        const command = isPlaying ? 'playVideo' : 'pauseVideo';
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: command, args: [] }),
          '*'
        );
      }
    }
  }, [isPlaying, youtubeId, isDirectVideo, url]);

  if (youtubeId) {
    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-black">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&enablejsapi=1&playsinline=1&rel=0&showinfo=0`}
          title="Background Video"
          className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 object-cover opacity-60 pointer-events-none"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Direct video or fallback
  const videoSrc = isDirectVideo ? url : fallbackVideoUrl;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
      />
    </div>
  );
};
