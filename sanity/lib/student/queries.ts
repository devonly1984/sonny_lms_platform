import { defineQuery } from "groq";
import { sanityFetch } from "../live";




export const getStudentByClerkId = async(clerkId:string)=>{
    const SBCquery = defineQuery(`*[_type=="student" && clerkId == $clerkId][0]`);
    const student = await sanityFetch({ query: SBCquery, params: { clerkId } });
    return student.data
}

