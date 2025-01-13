"use client";
import { useState, useCallback } from "react";
import Header from "@/components/Header";
import DisplayToggle from "@/components/DisplayToggle";
import AllCartContainer from "@/components/AllCartContainer";
import MyCartContainer from "@/components/MyCartContainer";
import Footer from "@/components/Footer";

type DisplayCart = "all" | "my";

export default function Dashboard() {
  const [showMyCarts, setShowMyCarts] = useState<DisplayCart>("all");

  const handleShowMyCarts = useCallback((displayCart: DisplayCart) => {
    setShowMyCarts(displayCart);
  }, []);

  return (
    <div className="flex flex-col h-screen mx-auto max-w-[375px] border">
      <div className="flex flex-col w-full">
        <Header />
        <DisplayToggle showMyCarts={showMyCarts} handleShowMyCarts={handleShowMyCarts} />
      </div>
      <div className="flex-1 overflow-y-auto">
        { showMyCarts === "my" ? <MyCartContainer /> : <AllCartContainer /> }
      </div>
      <Footer />
    </div>
  )
};