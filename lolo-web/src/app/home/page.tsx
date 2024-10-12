import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Settings,
  Users,
  Shield,
  ChevronRight,
  Link as LinkIcon,
  Search,
  Home,
  BarChart2,
  Trophy,
  Crosshair,
} from "lucide-react";
import Link from "next/link";

export default function LoLOHome() {
  return (
    <div className="min-h-screen bg-[#010A13] text-[#A09B8C] relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hpN2UwwY7s0OFwDFlX1KkpIBrHNCNe.png')",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <header className="bg-[#0A1428] bg-opacity-90 border-b border-[#785A28] p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-[#C8AA6E]">LoLO</h1>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5 text-[#C8AA6E]" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5 text-[#C8AA6E]" />
                </Button>
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#785A28]" />
                <Input
                  type="search"
                  placeholder="Search summoners, champions, teams..."
                  className="pl-8 bg-[#1E2328] border-[#785A28] text-[#C8AA6E] placeholder-[#785A28] w-full"
                />
              </div>
            </div>
          </div>
        </header>

        <nav className="bg-[#1E2328] bg-opacity-90 border-b border-[#785A28]">
          <div className="container mx-auto">
            <ul className="flex overflow-x-auto">
              {[
                { icon: Home, label: "Dashboard" },
                { icon: BarChart2, label: "My Stats" },
                { icon: Users, label: "My Teams" },
                { icon: Trophy, label: "Tournaments" },
                { icon: Crosshair, label: "Opponent Analysis" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={`/${item.label.toLowerCase().replace(" ", "-")}`}
                    className="flex items-center px-4 py-2 text-[#C8AA6E] hover:bg-[#785A28] hover:text-[#010A13] transition-colors"
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <main className="container mx-auto py-8 px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card className="bg-[#1E2328] bg-opacity-90 border-[#785A28]">
                <CardHeader>
                  <CardTitle className="text-[#C8AA6E]">Welcome back, Summoner</CardTitle>
                  <CardDescription>Your LoLO dashboard awaits</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="bg-[#785A28] text-[#C8AA6E] hover:bg-[#C8AA6E] hover:text-[#010A13]">
                    <LinkIcon className="mr-2 h-4 w-4" /> Link Riot Account
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#1E2328] bg-opacity-90 border-[#785A28]">
                <CardHeader>
                  <CardTitle className="text-[#C8AA6E]">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <li key={item} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={`/placeholder-champion-${item}.jpg`} alt={`Champion ${item}`} />
                            <AvatarFallback>C{item}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-[#C8AA6E]">Match Analysis Complete</p>
                            <p className="text-sm">Champion: Aphelios | KDA: 8/2/15</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[#3C95D4]">
                          View Details
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="bg-[#1E2328] bg-opacity-90 border-[#785A28]">
                <CardHeader>
                  <CardTitle className="text-[#C8AA6E]">Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm">Matches Analyzed</p>
                      <p className="text-2xl font-bold text-[#C8AA6E]">247</p>
                    </div>
                    <Badge variant="secondary" className="bg-[#0A1428] text-[#C8AA6E]">
                      Private
                    </Badge>
                  </div>
                  <Button variant="link" className="mt-4 text-[#3C95D4]">
                    Manage Privacy Settings <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#1E2328] bg-opacity-90 border-[#785A28]">
                <CardHeader>
                  <CardTitle className="text-[#C8AA6E]">Your Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-[#C8AA6E] mr-2" />
                        <span>Team Alpha</span>
                      </div>
                      <Badge>Owner</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-[#C8AA6E] mr-2" />
                        <span>Team Beta</span>
                      </div>
                      <Badge>Player</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4 w-full border-[#785A28] text-[#C8AA6E] hover:bg-[#785A28]">
                    Manage Teams
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
