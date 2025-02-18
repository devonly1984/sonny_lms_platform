import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Stripe from 'stripe';
import {config} from '@/lib/config'
const {
  stripe: { stripeSecretKey },
} = config;
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
if (!stripeSecretKey){
  throw new Error("STRIPE_SECRET_KEY is not set")
}
const stripe = new Stripe(stripeSecretKey, {
apiVersion: "2025-01-27.acacia",
});
export default stripe;