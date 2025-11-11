import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@/pages/Index";

interface TransactionsTabProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  onDeleteTransaction: (id: string) => void;
}

const categories = [
  "Allowance",
  "Chores",
  "Gift",
  "Birthday",
  "Toys",
  "Games",
  "Books",
  "Candy",
  "Savings",
  "Other",
];

const TransactionsTab = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
}: TransactionsTabProps) => {
  const { toast } = useToast();
  const [type, setType] = useState<"Income" | "Expense">("Income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Allowance");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Oops!",
        description: "Please enter a valid amount greater than 0!",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Hold on!",
        description: "Please tell us what this is for!",
        variant: "destructive",
      });
      return;
    }

    onAddTransaction({
      date: new Date().toISOString(),
      type,
      amount: amountNum,
      category,
      description: description.trim(),
    });

    toast({
      title: "Success! 🎉",
      description: `${type === "Income" ? "Money added" : "Expense recorded"}!`,
    });

    // Reset form
    setAmount("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      {/* Add Transaction Form */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup value={type} onValueChange={(v) => setType(v as "Income" | "Expense")}>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Income" id="income" />
                    <Label htmlFor="income" className="cursor-pointer text-base">
                      💵 Money In
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Expense" id="expense" />
                    <Label htmlFor="expense" className="cursor-pointer text-base">
                      💸 Money Out
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">What for?</Label>
              <Input
                id="description"
                placeholder="e.g., Ice cream, Toys, Allowance..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-lg">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-white text-lg py-6 hover:opacity-90 transition-opacity"
            >
              ➕ Add Transaction
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No transactions yet. Add your first one above! 👆
            </p>
          ) : (
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {transaction.type === "Income" ? (
                      <TrendingUp className="w-5 h-5 text-income" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-expense" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category} •{" "}
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-bold ${
                        transaction.type === "Income" ? "text-income" : "text-expense"
                      }`}
                    >
                      {transaction.type === "Income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsTab;
