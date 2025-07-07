import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CreateOrderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    type: "buy",
    fromToken: "",
    toToken: "",
    price: "",
    minLimit: "",
    maxLimit: "",
    visibility: "public",
    conditions: "",
    // autoAccept: false,
  });
  const { t } = useTranslation("create-order");

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // check if all required fields are filled
    if (
      !orderData.type ||
      !orderData.fromToken ||
      !orderData.toToken ||
      !orderData.price ||
      !orderData.minLimit ||
      !orderData.maxLimit ||
      !orderData.visibility ||
      !orderData.conditions
    ) {
      toast.error(t("step1.requiredFields"), { position: "top-center" });
      return;
    }

    // Handle order submission
    console.log("Order submitted:", orderData);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.subtitle")}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step <= currentStep
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? <Check className="h-4 w-4" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-24 h-0.5 mx-4 ${step < currentStep ? "bg-primary" : "bg-muted"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={currentStep >= 1 ? "text-primary" : "text-muted-foreground"}>
              {t("steps.details")}
            </span>
            <span className={currentStep >= 2 ? "text-primary" : "text-muted-foreground"}>
              {t("steps.settings")}
            </span>
            <span className={currentStep >= 3 ? "text-primary" : "text-muted-foreground"}>
              {t("steps.review")}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("step1.title")}</CardTitle>
            <CardDescription>{t("step1.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>{t("step1.type")}</Label>
              <RadioGroup
                value={orderData.type}
                onValueChange={(value) => setOrderData({ ...orderData, type: value })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="buy" id="buy" />
                  <Label htmlFor="buy">{t("step1.buy")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sell" id="sell" />
                  <Label htmlFor="sell">{t("step1.sell")}</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-token">{t("step1.fromToken")}</Label>
                <Select
                  value={orderData.fromToken}
                  onValueChange={(value) => setOrderData({ ...orderData, fromToken: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("step1.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                    <SelectItem value="usdt">Tether (USDT)</SelectItem>
                    <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                    <SelectItem value="dai">Dai (DAI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to-token">{t("step1.toToken")}</Label>
                <Select
                  value={orderData.toToken}
                  onValueChange={(value) => setOrderData({ ...orderData, toToken: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("step1.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                    <SelectItem value="usdt">Tether (USDT)</SelectItem>
                    <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                    <SelectItem value="dai">Dai (DAI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">{t("step1.price")}</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={orderData.price}
                onChange={(e) => setOrderData({ ...orderData, price: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-limit">{t("step1.minLimit")}</Label>
                <Input
                  id="min-limit"
                  type="number"
                  placeholder="0.00"
                  value={orderData.minLimit}
                  onChange={(e) => setOrderData({ ...orderData, minLimit: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-limit">{t("step1.maxLimit")}</Label>
                <Input
                  id="max-limit"
                  type="number"
                  placeholder="0.00"
                  value={orderData.maxLimit}
                  onChange={(e) => setOrderData({ ...orderData, maxLimit: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("step2.title")}</CardTitle>
            <CardDescription>{t("step2.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>{t("step2.visibility")}</Label>
              <RadioGroup
                value={orderData.visibility}
                onValueChange={(value) => setOrderData({ ...orderData, visibility: value })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public">{t("step2.public")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">{t("step2.private")}</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conditions">{t("step2.conditions")}</Label>
              <Textarea
                id="conditions"
                placeholder={t("step2.conditionsPlaceholder")}
                value={orderData.conditions}
                onChange={(e) => setOrderData({ ...orderData, conditions: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("step3.title")}</CardTitle>
            <CardDescription>{t("step3.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t("step3.orderType")}</span>
                <Badge variant={orderData.type === "buy" ? "default" : "secondary"}>
                  {orderData.type.toUpperCase()}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t("step3.tokenPair")}</span>
                <span className="font-medium">
                  {orderData.fromToken.toUpperCase()}/{orderData.toToken.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t("step3.price")}</span>
                <span className="font-medium">${orderData.price}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t("step3.limits")}</span>
                <span className="font-medium">
                  ${orderData.minLimit} - ${orderData.maxLimit}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t("step3.visibility")}</span>
                <span className="font-medium capitalize">{orderData.visibility}</span>
              </div>

              {orderData.conditions && (
                <div className="space-y-2">
                  <span className="text-muted-foreground">{t("step3.conditions")}</span>
                  <p className="text-sm bg-muted p-3 rounded-md">{orderData.conditions}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="gap-2 bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("actions.back")}
        </Button>

        {currentStep < 3 ? (
          <Button onClick={nextStep} className="gap-2">
            {t("actions.next")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="gap-2">
            <Check className="h-4 w-4" />
            {t("actions.submit")}
          </Button>
        )}
      </div>
    </div>
  );
}
