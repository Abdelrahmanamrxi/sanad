import React from "react";
import MarketingNavbar from "@/components/shared/MarketingNavbar";
import Footer from "@/components/shared/Footer";


export default function MarketingLayout({children}:{children:React.ReactNode}){
    return(
        <div className="min-h-screen flex flex-col">
            <MarketingNavbar/>
            <main className="flex-1">
            {children}
            </main>
            <Footer/>
        </div>
    )
}