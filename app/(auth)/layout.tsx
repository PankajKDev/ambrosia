import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      {children}
    </div>
  );
}

export default layout;
