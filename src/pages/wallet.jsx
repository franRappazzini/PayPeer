import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Download, QrCode, Send, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Mock data for wallet balances
const mockBalances = [
  {
    token: "BTC",
    name: "Bitcoin",
    balance: "0.5432",
    usdValue: "23,456.78",
    change24h: "+2.34",
    icon: "₿",
  },
  {
    token: "ETH",
    name: "Ethereum",
    balance: "12.8901",
    usdValue: "34,567.89",
    change24h: "-1.23",
    icon: "Ξ",
  },
  {
    token: "USDT",
    name: "Tether",
    balance: "5,678.90",
    usdValue: "5,678.90",
    change24h: "+0.01",
    icon: "₮",
  },
  {
    token: "USDC",
    name: "USD Coin",
    balance: "2,345.67",
    usdValue: "2,345.67",
    change24h: "0.00",
    icon: "$",
  },
  {
    token: "DAI",
    name: "Dai",
    balance: "1,234.56",
    usdValue: "1,234.56",
    change24h: "+0.02",
    icon: "◈",
  },
];

// Mock transaction history
const mockTransactions = [
  {
    id: "TX-001",
    type: "receive",
    token: "BTC",
    amount: "0.1234",
    from: "0x1234...5678",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "TX-002",
    type: "send",
    token: "ETH",
    amount: "2.5000",
    to: "0x8765...4321",
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: "TX-003",
    type: "receive",
    token: "USDT",
    amount: "1,000.00",
    from: "0xabcd...efgh",
    date: "2024-01-12",
    status: "pending",
  },
];

export default function WalletPage() {
  const [selectedToken, setSelectedToken] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const { t } = useTranslation("wallet");

  const totalUsdValue = mockBalances.reduce(
    (sum, token) => sum + Number.parseFloat(token.usdValue.replace(",", "")),
    0
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                {t("actions.receive")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("receive.title")}</DialogTitle>
                <DialogDescription>{t("receive.description")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="receive-token">{t("receive.selectToken")}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t("receive.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {mockBalances.map((token) => (
                        <SelectItem key={token.token} value={token.token}>
                          {token.icon} {token.name} ({token.token})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("receive.yourAddress")}</Label>
                  <div className="flex items-center gap-2">
                    <Input value="0x1234567890abcdef..." readOnly className="font-mono text-sm" />
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Send className="h-4 w-4" />
                {t("actions.send")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("send.title")}</DialogTitle>
                <DialogDescription>{t("send.description")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="send-token">{t("send.selectToken")}</Label>
                  <Select value={selectedToken} onValueChange={setSelectedToken}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("send.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {mockBalances.map((token) => (
                        <SelectItem key={token.token} value={token.token}>
                          {token.icon} {token.name} ({token.token})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient">{t("send.recipient")}</Label>
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">{t("send.amount")}</Label>
                  <Input
                    id="amount"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                </div>
                <Button className="w-full">{t("send.title")}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Portfolio Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {t("portfolio.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${totalUsdValue.toLocaleString()}</div>
          <p className="text-muted-foreground">{t("portfolio.value")}</p>
        </CardContent>
      </Card>

      {/* Balances and Transactions */}
      <Tabs defaultValue="balances" className="space-y-4">
        <TabsList>
          <TabsTrigger value="balances">{t("tabs.balances")}</TabsTrigger>
          <TabsTrigger value="transactions">{t("tabs.transactions")}</TabsTrigger>
        </TabsList>

        <TabsContent value="balances">
          <Card>
            <CardHeader>
              <CardTitle>{t("balances.title")}</CardTitle>
              <CardDescription>{t("balances.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("balances.columns.token")}</TableHead>
                      <TableHead>{t("balances.columns.balance")}</TableHead>
                      <TableHead>{t("balances.columns.usd")}</TableHead>
                      <TableHead>{t("balances.columns.change")}</TableHead>
                      <TableHead>{t("balances.columns.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBalances.map((token) => (
                      <TableRow key={token.token}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold">
                              {token.icon}
                            </div>
                            <div>
                              <div className="font-medium">{token.name}</div>
                              <div className="text-sm text-muted-foreground">{token.token}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{token.balance}</TableCell>
                        <TableCell className="font-medium">${token.usdValue}</TableCell>
                        <TableCell>
                          <div
                            className={`flex items-center gap-1 ${
                              token.change24h.startsWith("+")
                                ? "text-green-600"
                                : token.change24h.startsWith("-")
                                ? "text-red-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {token.change24h.startsWith("+") ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : token.change24h.startsWith("-") ? (
                              <TrendingDown className="h-3 w-3" />
                            ) : null}
                            {token.change24h}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              {t("actions.send")}
                            </Button>
                            <Button size="sm" variant="outline">
                              {t("actions.receive")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>{t("transactions.title")}</CardTitle>
              <CardDescription>{t("transactions.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("transactions.columns.id")}</TableHead>
                      <TableHead>{t("transactions.columns.type")}</TableHead>
                      <TableHead>{t("transactions.columns.token")}</TableHead>
                      <TableHead>{t("transactions.columns.amount")}</TableHead>
                      <TableHead>{t("transactions.columns.address")}</TableHead>
                      <TableHead>{t("transactions.columns.date")}</TableHead>
                      <TableHead>{t("transactions.columns.status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                        <TableCell>
                          <Badge variant={tx.type === "receive" ? "default" : "secondary"}>
                            {tx.type === "receive"
                              ? t("transactions.types.received")
                              : t("transactions.types.sent")}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{tx.token}</TableCell>
                        <TableCell className="font-mono">{tx.amount}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {tx.type === "receive" ? tx.from : tx.to}
                        </TableCell>
                        <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={tx.status === "completed" ? "default" : "secondary"}>
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
