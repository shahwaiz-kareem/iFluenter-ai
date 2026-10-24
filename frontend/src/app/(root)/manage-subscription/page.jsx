import SubscriptionManager from "@/components/manageSubscription/SubscriptionManager";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

const ManageSubscriptionPage = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="animate-spin" size={30} />
        </div>
      }
    >
      <SubscriptionManager />
    </Suspense>
  );
};

export default ManageSubscriptionPage;
