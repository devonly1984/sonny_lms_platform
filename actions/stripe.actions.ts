"use server";
import {config} from '@/lib/config'
import { stripe } from "@/lib/utils";
import { getCourseById } from '@/sanity/lib/courses/queries';
import { createUserIfNotExists } from '@/sanity/lib/student/queries';
import { clerkClient } from '@clerk/nextjs/server';
export const createStripeCheckout = async (
  courseId: string,
  clerkId: string
) => {
    const {
      stripe: { baseUrl },
    } = config;
    try {
      const course = await getCourseById(courseId);
      const clerkUser = await (await clerkClient()).users.getUser(clerkId);
      if (!clerkUser) {
        throw new Error("User not found");
      }
      const { emailAddresses, firstName, lastName, imageUrl } = clerkUser;
      const email = emailAddresses[0]?.emailAddress;
      if (!emailAddresses || !email) {
        throw new Error("User details not found");
      }
      if (!course) {
        throw new Error("Course not found");
      }
      const user = await createUserIfNotExists({
        clerkId,
        email: email || "",
        firstName: firstName || email,
        lastName: lastName || "",
        imageUrl: imageUrl || "",
      });

    } catch (error: any) {
      console.log("Error creating Stripe Checkout Session");
      throw new Error(error);
    }
};
