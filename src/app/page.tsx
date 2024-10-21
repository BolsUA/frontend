"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpenIcon, GraduationCapIcon, SearchIcon, TrendingUpIcon } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Find Your Perfect Scholarship</h2>
          <p className="text-xl mb-6">Discover opportunities to fund your education and achieve your goals.</p>
            <div className="flex w-full max-w-sm items-center space-x-2 mx-auto">
              <Input type="search" placeholder="Search scholarships..." />
              <Button type="submit">
                <SearchIcon className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCapIcon className="w-5 h-5 mr-2" />
                Available Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">250+</p>
              <p className="text-muted-foreground">Open opportunities</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpenIcon className="w-5 h-5 mr-2" />
                Fields of Study
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">50+</p>
              <p className="text-muted-foreground">Academic disciplines</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUpIcon className="w-5 h-5 mr-2" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">75%</p>
              <p className="text-muted-foreground">Application success</p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <Button size="lg" asChild>
            <Link href="/scholarships">Browse Scholarships</Link>
          </Button>
        </section>
      </main>
  );
}
