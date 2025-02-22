"use client"

import {
  CompleteLessonAction,
  getLessonStatusAction,
  unCompleteLessonAction,
} from "@/actions/lesson.actions";
import { cn } from "@/lib/utils";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

import { useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";

interface LessonProps {
    lessonId:string;
    clerkId:string;
}
const LessonCompleteButton = ({ lessonId, clerkId }: LessonProps) => {
    const [isPending, setIsPending] = useState(false);
    const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
    const [isPendingTransition,startTransition]  = useTransition()
    useEffect(() => {
      startTransition(async () => {
        try {
          const status = await getLessonStatusAction(lessonId, clerkId);
          setIsCompleted(status);
        } catch (error) {
          console.log("Error checking lesson completion status", error);
          setIsCompleted(false);
        }
      });
    }, [lessonId, clerkId]);
    const isLoading = isCompleted === null || isPendingTransition;
    const handleToggle = async()=>{
        try {
            setIsPending(true);
            if (isCompleted) {
                await unCompleteLessonAction(lessonId,clerkId);
            } else {
                await CompleteLessonAction(lessonId, clerkId);
            }
            startTransition(async()=>{
                const newStatus = await getLessonStatusAction(lessonId,clerkId)
                setIsCompleted(newStatus)
            })

        } catch (error) {
            console.log("Error Toggling lesson completion", error);
        }finally{
            setIsPending(false)
        }
    }
  return  <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-50">
  <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
    <div className="flex-1">
      <p className="text-sm font-medium">
        {isCompleted
          ? "Lesson completed!"
          : "Ready to complete this lesson?"}
      </p>
      <p className="text-sm text-muted-foreground">
        {isCompleted
          ? "You can mark it as incomplete if you need to revisit it."
          : "Mark it as complete when you're done."}
      </p>
    </div>
    <Button
      onClick={handleToggle}
      disabled={isPending || isLoading}
      size="lg"
      variant="default"
      className={cn(
        "min-w-[200px] transition-all duration-200 ease-in-out",
        isCompleted
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-green-600 hover:bg-green-700 text-white"
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Updating...
        </>
      ) : isPending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {isCompleted ? "Uncompleting..." : "Completing..."}
        </>
      ) : isCompleted ? (
        <>
          <XCircle className="h-4 w-4 mr-2" />
          Mark as Not Complete
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark as Complete
        </>
      )}
    </Button>
  </div>
</div>
};
export default LessonCompleteButton