"use server";

import {
  completeLessonById,
  getLessonCompletionStatus,
  unCompleteLessonById,
} from "@/sanity/lib/lessons/queries";

export const getLessonStatusAction = async (
  lessonId: string,
  clerkId: string
) => {
    try {
        return await getLessonCompletionStatus(lessonId, clerkId);
    } catch (error) {
      console.log("Error getting lesson completion status", error);
      return false;
    }
};
export const unCompleteLessonAction = async (
  lessonId: string,
  clerkId: string
) => {
    try {
            await unCompleteLessonById({
              lessonId,
              clerkId,
            });
    } catch (error) {
        console.log("Error uncompleting lesson",error)
        throw error;
    }
};
export const CompleteLessonAction = async (
  lessonId: string,
  clerkId: string
) => {
    try {
        await completeLessonById(lessonId, clerkId);
        return {success:true}
    } catch (error) {
        console.log("Error Completing Lesson",error)
        return { success: false, error: "Failed to complete lesson" };
    }
};