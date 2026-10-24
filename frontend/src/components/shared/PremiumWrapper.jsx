import { userContext } from "@/context/UserProvider";
import { cn } from "@/lib/utils";
import { Crown, Lock } from "lucide-react"; // Added Lock for clarity
import { useContext } from "react";

const PremiumWrapper = ({
  children,
  containerClass,
  iconClass,
  showBadge = true,
}) => {
  const { userData } = useContext(userContext);
  const isPremium = !userData?.subscriptionExpired;

  return (
    <div className={cn("relative", containerClass)}>
      {!isPremium && showBadge && (
        <div
          className={cn(
            "absolute -top-1 -right-1 z-20 p-0.5 bg-gradient-to-tr from-yellow-600 to-yellow-300 rounded-full shadow-lg border border-white/20 rotate-[28deg]",
            iconClass
          )}
        >
          <Crown size={20} className="text-white fill-white" />
        </div>
      )}
      {children}
    </div>
  );
};
export default PremiumWrapper;
