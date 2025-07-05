import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Globe, Lock, Shield, Users, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation("home");

  return (
    <main className="container mx-auto px-4 py-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {t("title")}
            <span className="text-primary block">{t("subtitle")}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("description")}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/app">{t("button.startTrading")}</Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
            {t("button.learnMore")}
          </Button>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">{t("problem.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t("problem.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-destructive" />
                {t("traditional.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">• {t("traditional.first")}</p>
              <p className="text-sm text-muted-foreground">• {t("traditional.second")}</p>
              <p className="text-sm text-muted-foreground">• {t("traditional.third")}</p>
              <p className="text-sm text-muted-foreground">• {t("traditional.fourth")}</p>
              <p className="text-sm text-muted-foreground">• {t("traditional.fifth")}</p>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {t("payPeer.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">• {t("payPeer.first")}</p>
              <p className="text-sm text-muted-foreground">• {t("payPeer.second")}</p>
              <p className="text-sm text-muted-foreground">• {t("payPeer.third")}</p>
              <p className="text-sm text-muted-foreground">• {t("payPeer.fourth")}</p>
              <p className="text-sm text-muted-foreground">• {t("payPeer.fifth")}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">{t("whyPP.title")}</h2>
          <p className="text-lg text-muted-foreground">{t("whyPP.description")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Lock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t("whyPP.firstCard.title")}</CardTitle>
              <CardDescription>{t("whyPP.firstCard.description")}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t("whyPP.secondCard.title")}</CardTitle>
              <CardDescription>{t("whyPP.secondCard.description")}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t("whyPP.thirdCard.title")}</CardTitle>
              <CardDescription>{t("whyPP.thirdCard.description")}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t("whyPP.fourthCard.title")}</CardTitle>
              <CardDescription>{t("whyPP.fourthCard.description")}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t("whyPP.fifthCard.title")}</CardTitle>
              <CardDescription>{t("whyPP.fifthCard.description")}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Eye className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t("whyPP.sixthCard.title")}</CardTitle>
              <CardDescription>{t("whyPP.sixthCard.description")}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6 py-12 bg-muted/50 rounded-lg">
        <h2 className="text-3xl font-bold">{t("cta.title")}</h2>
        <p className="text-lg text-muted-foreground">{t("cta.description")}</p>
        <Button asChild size="lg" className="text-lg px-8">
          <Link href="/app">{t("cta.button")}</Link>
        </Button>
      </section>
    </main>
  );
}
