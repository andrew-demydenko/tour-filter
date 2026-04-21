import { Header, TourSearchWidget } from "@/widgets";

export const TourSearchPage = () => {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="container mx-auto flex-1 py-6 px-6 flex">
        <TourSearchWidget />
      </div>
    </div>
  );
};
