import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals } from "@/hooks/useGoals";
import BalanceCard from "@/components/BalanceCard";
import TransactionsTab from "@/components/TransactionsTab";
import GoalsTab from "@/components/GoalsTab";
import ChartsTab from "@/components/ChartsTab";

// Re-export types for backward compatibility with components
export type { Transaction } from "@/hooks/useTransactions";
export type { Goal } from "@/hooks/useGoals";

const Index = () => {
  const { signOut, user } = useAuth();
  const {
    transactions,
    isLoading: transactionsLoading,
    addTransaction,
    deleteTransaction,
  } = useTransactions();
  const {
    goals,
    isLoading: goalsLoading,
    addGoal,
    deleteGoal,
    updateGoalProgress,
  } = useGoals();

  const calculateBalance = () => {
    return transactions.reduce((balance, transaction) => {
      return transaction.type === "Income"
        ? balance + transaction.amount
        : balance - transaction.amount;
    }, 0);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Show loading state while fetching data
  if (transactionsLoading || goalsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Loading your piggy bank...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <div className="container max-w-6xl mx-auto p-4 md:p-8">
        {/* Header with Logout */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
            <span className="text-5xl animate-bounce-slow">🐷</span>
            Piggy Bank Pro
            <span className="text-5xl animate-bounce-slow">🐷</span>
          </h1>
          <p className="text-lg text-muted-foreground">Track your money like a pro!</p>
          {user?.email && (
            <p className="text-sm text-muted-foreground mt-2">
              Logged in as: {user.email}
            </p>
          )}
        </div>

        {/* Balance Card */}
        <BalanceCard balance={calculateBalance()} />

        {/* Main Content Tabs */}
        <Card className="mt-6 border-2 shadow-lg animate-in fade-in slide-in-from-bottom duration-700">
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="transactions" className="text-sm md:text-base py-3">
                💰 Money In/Out
              </TabsTrigger>
              <TabsTrigger value="goals" className="text-sm md:text-base py-3">
                🎯 Savings Goals
              </TabsTrigger>
              <TabsTrigger value="charts" className="text-sm md:text-base py-3">
                📊 Charts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="p-4 md:p-6">
              <TransactionsTab
                transactions={transactions}
                onAddTransaction={addTransaction}
                onDeleteTransaction={deleteTransaction}
              />
            </TabsContent>

            <TabsContent value="goals" className="p-4 md:p-6">
              <GoalsTab
                goals={goals}
                balance={calculateBalance()}
                onAddGoal={addGoal}
                onDeleteGoal={deleteGoal}
                onUpdateProgress={updateGoalProgress}
              />
            </TabsContent>

            <TabsContent value="charts" className="p-4 md:p-6">
              <ChartsTab transactions={transactions} />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Keep saving and you'll reach your goals! 🌟</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
