/** @format */

import CampaignProgress from "@/components/CampaignProgress";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import RecentContributors from "@/components/RecentContributors";
import StatsDashboard from "@/components/StatsDashboard";


export default function HomePage() {
  return (
    <main>
      {/* <Navbar /> */}
      <Hero />
      <StatsDashboard/>
      <CampaignProgress/>
       <RecentContributors />
       <Footer/>
    </main>
  );
}