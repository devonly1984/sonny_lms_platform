import { sanityFetch } from "../live";
import { defineQuery } from "groq";
import { adminClient } from "../adminClient";
export const getCourses = async () => {
  const GCquery = defineQuery(`*[_type=="course"] {
    ...,
        "slug": slug.current,
        "category": category->{...},
        "instructor":instructor->{...}
        }`);
  const courses = await sanityFetch({ query: GCquery });
  return courses.data;
};
export const searchCourses = async (query: string) => {
  if (!query || query === "") {
    return;
  }
  const searchQuery =
    defineQuery(`*[_type=="courses" && (title match $query + "*" || 
    description match $query + "*"||
    category->name match $query+"*")] 
    {
    ...,
    "slug":slug.current,
    "category":category->{...},
    "instructor":instructor->{...}
    }`);
  const CourseQuery = await sanityFetch({
    query: searchQuery,
    params: { query },
  });
  return CourseQuery.data;
};
export const getCourseBySlug = async (slug: string) => {
  const getCourseBySlugQuery =
    defineQuery(`*[_type=="course" && slug.current==$slug][0]{
    ...,
    "category":category->{...},
    "instructor": instructor->{...},
    "modules": modules[]->{...,
    "lessons":lessons[]->{...}},

    }`);
  const query = await sanityFetch({
    query: getCourseBySlugQuery,
    params: { slug },
  });
  return query.data;
};
export const getCourseById = async (id: string) => {
  const query = defineQuery(`*[_type=="course" && _id ==$id][0] {
    ...,
      "category":category->{...},
    "instructor": instructor->{...},
    "modules": modules[]->{...,
    "lessons":lessons[]->{...}},
    
    }`);
  const course = await sanityFetch({
    query,
    params: { id },
  });
  return course.data;
};
interface CreateEnrollmentParams {
  studentId: string;
  courseId: string;
  paymentId: string;
  amount: number;
}
export const createEnrollment = async ({
  studentId,
  courseId,
  paymentId,
  amount,
}: CreateEnrollmentParams) => {
  return adminClient.create({
    _type: "entrollment",
    student: {
      _type: "reference",
      _ref: studentId,
    },
    course: {
      _type: "reference",
      _ref: courseId,
    },
    paymentId,
    amount,
    enrolledAt: new Date().toISOString(),
  });
};