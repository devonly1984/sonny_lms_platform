"use client"
interface LoomProps {
  shareUrl: string;
}
const LoomEmbed = ({ shareUrl }: LoomProps) => {
    const embedUrl = shareUrl.replace("/share/","/embed/").split("?")[0]
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
      <iframe src={embedUrl} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
};
export default LoomEmbed