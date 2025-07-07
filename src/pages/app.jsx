import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Search } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Mock data for orders
const mockOrders = [
  {
    id: "1",
    type: "buy",
    tokenPair: "BTC/USDT",
    price: "43,250",
    minLimit: "100",
    maxLimit: "5,000",
    advertiser: "0x1234...5678",
    rating: 98,
    orders: 156,
  },
  {
    id: "2",
    type: "sell",
    tokenPair: "ETH/USDC",
    price: "2,680",
    minLimit: "50",
    maxLimit: "2,000",
    advertiser: "0x8765...4321",
    rating: 95,
    orders: 89,
  },
  {
    id: "3",
    type: "buy",
    tokenPair: "BTC/USDT",
    price: "43,180",
    minLimit: "200",
    maxLimit: "10,000",
    advertiser: "0xabcd...efgh",
    rating: 100,
    orders: 234,
  },
  {
    id: "4",
    type: "sell",
    tokenPair: "USDT/DAI",
    price: "1.001",
    minLimit: "100",
    maxLimit: "50,000",
    advertiser: "0x9876...1234",
    rating: 92,
    orders: 67,
  },
];

export default function AppPage() {
  const [activeTab, setActiveTab] = useState("buy");
  const [selectedPair, setSelectedPair] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation("app");

  const filteredOrders = mockOrders.filter((order) => {
    const matchesType = activeTab === "all" || order.type === activeTab;
    const matchesPair =
      selectedPair === "all" || order.tokenPair.includes(selectedPair.toUpperCase());
    const matchesSearch =
      order.advertiser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tokenPair.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesPair && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.subtitle")}</p>
        </div>
        <Button>
          <Link to="/app/orders/create">{t("page.createOrder")}</Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {t("filters.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pair">{t("filters.pair")}</Label>
              <Select value={selectedPair} onValueChange={setSelectedPair}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.allPairs")}</SelectItem>
                  <SelectItem value="btc">BTC</SelectItem>
                  <SelectItem value="eth">ETH</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                  <SelectItem value="usdc">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">{t("filters.search")}</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder={t("filters.searchPlaceholder")}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-amount">{t("filters.minAmount")}</Label>
              <Input id="min-amount" placeholder="0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-amount">{t("filters.maxAmount")}</Label>
              <Input id="max-amount" placeholder="∞" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="buy">{t("tabs.buy")}</TabsTrigger>
              <TabsTrigger value="sell">{t("tabs.sell")}</TabsTrigger>
              <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead>Type</TableHead> */}
                  <TableHead>{t("table.headers.pair")}</TableHead>
                  <TableHead>{t("table.headers.price")}</TableHead>
                  <TableHead>{t("table.headers.limits")}</TableHead>
                  <TableHead>{t("table.headers.advertiser")}</TableHead>
                  <TableHead>{t("table.headers.rating")}</TableHead>
                  <TableHead>{t("table.headers.action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    {/* <TableCell>
                      <Badge variant={order.type === "buy" ? "default" : "secondary"}>
                        {order.type.toUpperCase()}
                      </Badge>
                    </TableCell> */}
                    <TableCell className="font-medium">{order.tokenPair}</TableCell>
                    <TableCell>${order.price}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          ${order.minLimit} - ${order.maxLimit}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-mono">{order.advertiser}</div>
                        <div className="text-muted-foreground">
                          {order.orders} {t("table.ordersLabel")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-green-600">
                        {order.rating}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={order.type === "buy" ? "default" : "outline"}
                        className={`cursor-pointer ${
                          order.type === "buy"
                            ? "bg-green-700 text-white hover:bg-green-800"
                            : "bg-red-700 text-white hover:bg-red-800 hover:text-white"
                        }`}
                      >
                        {order.type === "buy" ? t("table.actions.buy") : t("table.actions.sell")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">{t("table.noResults")}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
