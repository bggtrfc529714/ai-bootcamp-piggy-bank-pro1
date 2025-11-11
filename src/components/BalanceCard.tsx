import { Card } from "@/components/ui/card";
import { Coins } from "lucide-react";

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  return (
    <Card className="gradient-secondary border-0 shadow-xl animate-in fade-in zoom-in duration-500">
      <div className="p-6 md:p-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Coins className="w-8 h-8 text-white animate-pulse" />
          <h2 className="text-xl md:text-2xl font-bold text-white">Your Balance</h2>
        </div>
        <div className="text-5xl md:text-6xl font-bold text-white mt-4">
          ${balance.toFixed(2)}
        </div>
        <p className="text-white/90 mt-2 text-sm md:text-base">
          {balance > 0 ? "Great job saving! 🎉" : "Start adding some money! 💪"}
        </p>
      </div>
    </Card>
  );
};

export default BalanceCard;
