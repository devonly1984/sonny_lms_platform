"use client";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { calculateCourseProgress, cn } from "@/lib/utils";
import { GetCompletionsQueryResult, Module, QueryResult } from "@/sanity.types";
import { ChevronRight, Library } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarContent from "./SidebarContent";

interface SidebarProps {
  course: QueryResult;
  completedLessons?: GetCompletionsQueryResult["completedLessons"];
}
const Sidebar = ({ course, completedLessons }: SidebarProps) => {
    const pathname = usePathname();
    const {isOpen,toggle,close} = useSidebar()
        const [openModules, setOpenModules] = useState<string[]>([])
        useEffect(() => {
          if (pathname && course?.modules) {
            const currentModuleId = course.modules.find((m) =>
              m.lessons?.some(
                (lesson) =>
                  pathname ===
                  `/dashboard/courses/${course._id}/lessons/${lesson._id}`
              )
            )?._id;
            if (currentModuleId && !openModules.includes(currentModuleId)) {
              setOpenModules((prev) => [...prev, currentModuleId]);
            }
          }
        }, [pathname, course, openModules]); 
        if (!course) {
      return null;
    } 

    const progress =
      completedLessons &&
      calculateCourseProgress(
        course.modules as unknown as Module[],
        completedLessons
      ); 
   
    return (
      <>
        <aside className="fixed inset-y-0 left-0 z-50 flex flex-col items-center w-[60px] border-r bg-background lg:hidden py-4 gap-y-4">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" prefetch={false}>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <Library className="size-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Course Library</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggle}
                  variant="ghost"
                  size="icon"
                  className="size-10"
                >
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Toggle Sidebar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </aside>
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 bg-background transition-all duration-300 ease-in-out",
            "lg:z-50 lg:block lg:w-96 lg:border-r",
            isOpen
              ? "w-[calc(100%-60px)] translate-x-[60px] lg:translate-x-0 lg:w-96"
              : "translate-x-[-100%] lg:translate-x-0"
          )}
        >
          <div className="h-full">
            <SidebarContent
              course={course}
              progress={progress}
              openModules={openModules}
              setOpenModules={setOpenModules}
              completedLessons={completedLessons!}
            />
          </div>
        </aside>
        {isOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={close}
          />
        )}
      </>
    );
  
};
export default Sidebar