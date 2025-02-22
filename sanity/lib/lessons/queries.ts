import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { getStudentByClerkId } from "../student/queries";
import { adminClient } from "../adminClient";

export const getLessonCompletions = async (
  studentId: string,
  courseId: string
) => {
  const getCompletionsQuery = defineQuery(`{
        "completedLessons":*[_type == "lessonCompletion" && student._ref == $studentId && course._ref == $courseId] {
        ...,
        "lesson":lesson->{...},
        "module":module->{...}
        },
        "course": *[_type == "course" && _id == $courseId][0] {
        ...,
        "modules":modules[]->{
        ...,
        "lessons":lessons[]->{...}
        }
           }
        
           }`);
  const result = await sanityFetch({
    query: getCompletionsQuery,
    params: { studentId, courseId },
  });
  const { course, completedLessons } = result.data;

  const totalLessons =
    course?.modules?.reduce(
      (acc, module) => acc + (module?.lessons?.length || 0),
      0
    ) || 0;
  const totalCompleted = completedLessons.length || 0;
  const courseProgress =
    totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0;
  return {
    completedLessons: completedLessons || [],
    courseProgress,
  };
};
export const getLessonById = async (lessonId: string) => {
  const getLessonByIdQuery = defineQuery(`*[_type=="lesson" && _id == $id][0] {
    ...,
    "module":module->{...,"course":course->{...}},

    }`);
  const result = await sanityFetch({
    query: getLessonByIdQuery,
    params: { lessonId },
  });
  return result.data;
};
export const getLessonCompletionStatus = async (
  lessonId: string,
  clerkId: string
) => {
  const student = await getStudentByClerkId(clerkId);
  if (!student?._id) {
    throw new Error("Student not found");
  }
  const completionStatusQuery =
    defineQuery(`*[_type=="lessonCompletion" && student._ref == $studentId && lesson._ref==$lessonId][0] {
    ...
    }`);
  const result = await sanityFetch({
    query: completionStatusQuery,
    params: { studentId: student._id, lessonId },
  });
  return result.data !== null;
};
export const completeLessonById = async (lessonId: string, clerkId: string) => {
  try {
    const student = await getStudentByClerkId(clerkId);
    if (!student?._id) {
      throw new Error("Student not found");
    }
    const existingCompletion = await sanityFetch({
      query: defineQuery(
        `*[_type=="lessonCompletion" && student._ref==$studentId && lesson._ref==$lessonId][0]`
      ),
      params: { studentId: student._id, lessonId },
    });
    if (existingCompletion.data) {
      return existingCompletion.data;
    }
    const lesson = await sanityFetch({
      query: defineQuery(`*[_type=="lesson" && _id==$lessonId][0] {
        _id,
        "module": *[_type=="module" && references(^._id)][0] {
        _id,
        "course":*[_type=="course"&&references(^._id)][0]._id
        }
        }`),
      params: { lessonId },
    });
    if (!lesson?.data?.module?._id || !lesson.data.module.course) {
      throw new Error("Couldn't find module or course for this lesson");
    }
    const completion = await adminClient.create({
      _type: "lessonCompletion",
      student: {
        _type: "reference",
        _ref: student?._id,
      },
      lesson: {
        _type: "reference",
        _ref: lessonId,
      },
      module: {
        _type: "reference",
        _ref: lesson.data.module._id,
      },
      course: {
        _type: "reference",
        _ref: lesson.data.module.course,
      },
      completedAt: new Date().toISOString(),
    });
    return completion;
  } catch (error) {
    console.log("Error completing lessons", error);
    throw error;
  }
};
export const unCompleteLessonById = async ({
  lessonId,
  clerkId,
}: {
  lessonId: string;
  clerkId: string;
}) => {
  try {
    const student = await getStudentByClerkId(clerkId);
    if (!student?._id) {
      throw new Error("Student not found");
    }

    await adminClient.delete({
      query: `*[_type=="lessonCompletion" && student._ref==$studentId && lesson._ref==$lessonId][0]`,
      params: { studentId: student?._id, lessonId },
    });
  } catch (error) {
    console.log("Error completing lessons", error);
    throw error;
  }
};