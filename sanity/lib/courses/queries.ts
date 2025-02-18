import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export const getCourses = async()=>{
  const GCquery = defineQuery(`*[_type=="course"] {
    ...,
        "slug": slug.current,
        "category": category->{...},
        "instructor":instructor->{...}
        }`);
  const courses = await sanityFetch({ query:GCquery });
  return courses.data;
}
export const searchCourses = async(query:string)=>{
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
}
export const getCourseBySlug = async(slug:string)=>{
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
      params: {slug},
    })
    return query.data;
}