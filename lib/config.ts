export const config = {
    clerk: {
        clerkPublic: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        clerkSecret: process.env.CLERK_SECRET_KEY
    },
    sanity: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET
    }
}