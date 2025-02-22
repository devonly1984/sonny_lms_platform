import { getCourseById } from "@/sanity/lib/courses/queries";
import { getStudentByClerkId, isEnrolledInCourse } from "@/sanity/lib/student/queries";

interface AuthResult {
  isAuthorized: boolean;
  redirect?: string;
  studentId?: string;
}
export const checkCourseAccess = async(clerkId:string|null,courseId:string):Promise<AuthResult>=>{
    if (!clerkId) {
        return {
          isAuthorized: false,
          redirect: "/",
        };
    }
    const student = await getStudentByClerkId(clerkId);
    if (!student?._id) {
        return {
          isAuthorized: false,
          redirect: "/",
        };
    }
    const isEnrolled = await isEnrolledInCourse(clerkId,courseId);
    const course = await getCourseById(courseId);
    if (!isEnrolled) {
        return {
            isAuthorized:false,
            redirect: `/courses/${course?.slug?.current}`
        }
    }
    return {
        isAuthorized:true,
        studentId:student._id
    }
} 