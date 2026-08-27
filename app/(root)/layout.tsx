import Navbar from "@/components/shared/Navbar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="flex flex-col min-h-screen w-full">{children}</div>
    </div>
  );
}

export default layout;
