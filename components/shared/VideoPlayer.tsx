"use client"
import dynamic from "next/dynamic"
const ReactPlayer = dynamic(()=>import('react-player/lazy'),{ssr:false})
interface VideoProps {
    url:string
}
const VideoPlayer = ({url}:VideoProps) => {
  return (
    <div className="relative aspect-video">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        playing={false}
      />
    </div>
  );
}

export default VideoPlayer