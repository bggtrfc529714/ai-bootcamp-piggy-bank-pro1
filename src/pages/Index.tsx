import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BalanceCard from "@/components/BalanceCard";
import TransactionsTab from "@/components/TransactionsTab";
import GoalsTab from "@/components/GoalsTab";
import ChartsTab from "@/components/ChartsTab";

export interface Transaction {
  id: string;
  date: string;
  type: "Income" | "Expense";
  amount: number;
  category: string;
  description: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: new Date().toISOString(),
      type: "Income",
      amount: 10,
      category: "Allowance",
      description: "Weekly allowance",
    },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "New Bike",
      targetAmount: 150,
      currentAmount: 10,
    },
  ]);

  const calculateBalance = () => {
    return transactions.reduce((balance, transaction) => {
      return transaction.type === "Income"
        ? balance + transaction.amount
        : balance - transaction.amount;
    }, 0);
  };

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const addGoal = (goal: Omit<Goal, "id" | "currentAmount">) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
      currentAmount: 0,
    };
    setGoals([...goals, newGoal]);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const updateGoalProgress = (id: string, amount: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
          : goal
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <div className="container max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
            <span className="text-5xl animate-bounce-slow">🐷</span>
            Piggy Bank Pro
            <span className="text-5xl animate-bounce-slow">🐷</span>
          </h1>
          <p className="text-lg text-muted-foreground">Track your money like a pro!</p>
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
