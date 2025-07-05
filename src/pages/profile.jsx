import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Edit, Hash, Save, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    id: "0x1234567890abcdef",
    name: "CryptoTrader",
    email: "trader@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2023-01-15",
    positiveFeedback: 156,
    negativeFeedback: 3,
    totalOrders: 89,
    community: "Verified Trader",
  });
  const { t } = useTranslation("profile");

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save the profile data
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any changes
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t("page.title")}</h1>
          <p className="text-muted-foreground">{t("page.subtitle")}</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            {t("page.edit")}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              {t("page.save")}
            </Button>
            <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
              <X className="h-4 w-4" />
              {t("page.cancel")}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("sections.personal.title")}</CardTitle>
            <CardDescription>{t("sections.personal.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="outline" size="sm">
                  {t("sections.personal.avatar")}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-id">{t("sections.personal.id")}</Label>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <Input id="user-id" value={profile.id} readOnly className="font-mono text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="join-date">{t("sections.personal.joinDate")}</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="join-date"
                    value={new Date(profile.joinDate).toLocaleDateString()}
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">{t("sections.personal.name")}</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("sections.personal.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="community">{t("sections.personal.community")}</Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{profile.community}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("sections.stats.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("sections.stats.totalOrders")}
                </span>
                <span className="font-semibold">{profile.totalOrders}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">
                    {t("sections.stats.positive")}
                  </span>
                </div>
                <span className="font-semibold text-green-600">{profile.positiveFeedback}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-muted-foreground">
                    {t("sections.stats.negative")}
                  </span>
                </div>
                <span className="font-semibold text-red-600">{profile.negativeFeedback}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("sections.stats.successRate")}
                </span>
                <Badge variant="outline" className="text-green-600">
                  {Math.round(
                    (profile.positiveFeedback /
                      (profile.positiveFeedback + profile.negativeFeedback)) *
                      100
                  )}
                  %
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("sections.security.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                {t("sections.security.changePassword")}
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                {t("sections.security.2fa")}
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                {t("sections.security.privacy")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
