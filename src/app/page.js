import AdvertisementSection from "@/components/AdvertisementSection";
import Banner from "@/components/Banner";
import LatestTickets from "@/components/LatestTickets";
import { PopularRoutes } from "@/components/PopularRoutes";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <div className="items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     
      <Banner />
      <AdvertisementSection/>
      <LatestTickets/>
      <PopularRoutes />
      <WhyChooseUs />

    </div>
  );
}
