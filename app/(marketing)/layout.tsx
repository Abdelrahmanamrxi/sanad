import React from "react";
import MarketingNavbar from "@/components/shared/marketing-navbar";
import Footer from "@/components/shared/footer";


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