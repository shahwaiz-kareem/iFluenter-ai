import "@/app/globals.css";
import TopLoader from "@/components/shared/TopLoader";
import { Toaster } from "@/components/ui/toaster";
import UserStoreProvider from "../store/UserStoreProvider";

export const metadata = {
  title: "iFluenter || Account",
  description: "Customize account in to iFluenter.",
};

function RootLayout({ children }) {
  return (
    <section>
      <UserStoreProvider>
        <TopLoader showSpinner={false} />
        <Toaster />
        <main className="w-full min-h-screen flex items-center justify-center overflow-y-hidden">
          {children}
        </main>
      </UserStoreProvider>
    </section>
  );
}

export default RootLayout;
