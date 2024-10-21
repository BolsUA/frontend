"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import Image from "next/image"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  House,
  School,
  FileUser,
  GraduationCap,
  UserCog,
  Award,
  Moon,
  Sun,
  Check,
  Monitor,
  LucideProps,
  LogIn,
} from "lucide-react"


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"

export const iframeHeight = "800px"

export const description = "A sidebar that collapses to icons."

// This is sample data.
const data: {
  contents: {
    [key: string]: {
      name: string;
      url: string;
      icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    }[];
  };
} = {
  contents: {
    navMain: [
      {
        name: "Home",
        url: "/",
        icon: House,
      },
      {
        name: "Scholarships",
        url: "/scholarships",
        icon: School,
      }
    ],
    student: [
      {
        name: "My applications",
        url: "/applications",
        icon: GraduationCap,
      }
    ],
    promoter: [
      {
        name: "My proposals",
        url: "/proposals",
        icon: FileUser,
      }
    ],
    secretary: [
      {
        name: "Review proposals",
        url: "/secretary/proposals",
        icon: Award,
      }
    ],
    jury: [
      {
        name: "Review applications",
        url: "/jury/applications",
        icon: UserCog,
      }
    ]
  }
}

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const getCurrentThemeIcon = () => {
    if (theme === "light") return <Sun className="size-4 mr-2" />
    if (theme === "dark") return <Moon className="size-4 mr-2" />
    return <Monitor className="size-4 mr-2" />
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/" className="group-data-[state=expanded]:flex group-data-[state=expanded]:items-center group-data-[state=expanded]:justify-center flex-shrink-0">
                  <Image
                    src="/BolsUA.png"
                    alt="BolsUA Logo"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-lg object-contain flex-shrink-0"
                  />
                  <span className="text-lg font-semibold">BolsUA</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
            <SidebarMenu>
              {data.contents.navMain.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Student</SidebarGroupLabel>
            <SidebarMenu>
              {data.contents.student.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Promoter</SidebarGroupLabel>
            <SidebarMenu>
              {data.contents.promoter.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Secretary</SidebarGroupLabel>
            <SidebarMenu>
              {data.contents.secretary.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Jury</SidebarGroupLabel>
            <SidebarMenu>
              {data.contents.jury.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {
            status === "authenticated" && session.user ? (
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={session.user.image as string}
                            alt={session.user.name as string}
                          />
                          <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {session.user.name}
                          </span>
                          <span className="truncate text-xs">
                            {session.user.email}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      side="bottom"
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                              src={session.user.image as string}
                              alt={session.user.name as string}
                            />
                            <AvatarFallback className="rounded-lg">
                              JD
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                              {session.user.name}
                            </span>
                            <span className="truncate text-xs">
                              {session.user.email}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <BadgeCheck />
                          Account
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell />
                          Notifications
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <div className="flex items-center">
                              {getCurrentThemeIcon()}
                              <span>Theme</span>
                            </div>
                          </DropdownMenuSubTrigger>

                          <DropdownMenuSubContent className="min-w-[150px]">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                              <Sun className="size-4" />
                              Light Mode
                              {theme === "light" && <Check className="ml-auto" />}
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                              <Moon className="size-4" />
                              Dark Mode
                              {theme === "dark" && <Check className="ml-auto" />}
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => setTheme("system")}>
                              <Monitor className="size-4" />
                              System Default
                              {theme === "system" && <Check className="ml-auto" />}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => signOut()}>
                        <LogOut />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            ) : (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="font-semibold" onClick={() => signIn("cognito")}>
                    <LogIn />
                    <span>Sign In</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )
          }

        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {
                  pathname !== "/" && (
                    <>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="/">
                          Home
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  )
                }
                {
                  Object.keys(data.contents).map((key) => {
                    const value = data.contents[key];
                    const current = value.find((item) => item.url === pathname && pathname !== "/");
                    if (current) {
                      return (
                        <>
                          {
                            key !== "navMain" && (
                              <>
                                <BreadcrumbItem className="hidden md:block">
                                  <BreadcrumbLink>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                              </>
                            )
                          }
                          <BreadcrumbItem className="hidden md:block" key={current.name}>
                            <BreadcrumbLink href={current.url}>
                              {current.name}
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                        </>
                      )
                    }
                  })
                }
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}