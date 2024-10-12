import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoLOSplitter from "@/components/lolo-ui/lolo-splitter";
import googleLogo from "@/public/google-button.svg";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#010A13] text-[#A09B8C]">
      <header className="flex justify-between items-center p-4 border-b border-[#1E2328]">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-[#C8AA6E]">LoLO</h1>
        </div>
        <div className="flex items-center">
          <span className="mr-2">English</span>
          <svg
            className="w-4 h-4 text-[#C8AA6E]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#C8AA6E]">Sign in</h2>
            <p className="mt-2">Welcome to League of Legends Optimizer community</p>
          </div>

          <div className="mt-6">
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="bg-[#1E2328] border-[#785A28] text-[#C8AA6E]">
                <Image priority src={googleLogo} alt="G" />
              </Button>
              <Button variant="outline" className="bg-[#1E2328] border-[#785A28] text-[#C8AA6E]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </Button>
            </div>
          </div>

          <LoLOSplitter />

          <div className="mt-8 space-y-6">
            <div className="text-center">
              <a href="#" className="text-[#3C95D4] hover:underline">
                Sign in with a one-time code instead
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-8 text-center pb-4">
        <div className="mt-4 space-x-4">
          <a href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
            Terms of Use
          </a>
          <a href="#" className="text-[#A09B8C] hover:text-[#C8AA6E]">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
