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