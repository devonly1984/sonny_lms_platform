import LessonCompleteButton from "@/components/lessons/LessonCompleteButton";
import LoomEmbed from "@/components/shared/LoomEmbed";
import VideoPlayer from "@/components/shared/VideoPlayer";
import { getLessonById } from "@/sanity/lib/lessons/queries";
import { currentUser } from "@clerk/nextjs/server";
import { PortableText } from "next-sanity";
import { redirect } from "next/navigation";

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}
const LessonPage = async({params}:LessonPageProps) => {
  const user = await currentUser();

  const { courseId, lessonId } = await params;
  const lesson = await getLessonById(lessonId);

if (!lesson) {
  redirect(`/dashoard/courses/${courseId}`);
}

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto pt-12 pb-20 px-4">
          <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
          {lesson.description && (
            <p className="text-muted-foreground mb-8">{lesson.description}</p>
          )}
          <div className="space-y-8">
            {lesson.videoUrl && <VideoPlayer url={lesson.videoUrl} />}
            {lesson.loomUrl && <LoomEmbed shareUrl={lesson.loomUrl} />}
            {/**Content */}
            {lesson.content && (
              <div className="">
                <h2 className="text-xl font-semibold mb-4">Lesson Notes</h2>
                <div className="prose prose-blue dark:prose-invert max-w-none">
                  <PortableText value={lesson.content} />
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <LessonCompleteButton lessonId={lesson._id} clerkId={user!.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LessonPage;
