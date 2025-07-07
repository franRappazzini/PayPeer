import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Edit, Loader2, Save, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConnectButton from "@/components/shared/connect-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useAuthStore from "@/store/auth-store";
import { useTranslation } from "react-i18next";
import useUser from "../hooks/use-user";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { editUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(user);

  const { t } = useTranslation("profile");

  useEffect(() => {
    if (user) setProfile(user);
    console.log({ user });
  }, [user]);

  if (profile.loading)
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center">{t("page.loading")}</h1>
        <p className="text-muted-foreground text-center">{t("page.loadingDescription")}</p>
      </div>
    );

  if (!profile.data)
    return (
      <div className="container mx-auto px-4 py-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center">{t("page.callToLogin")}</h1>
        <p className="text-muted-foreground text-center mb-4">{t("page.callToLoginDescription")}</p>
        <ConnectButton />
      </div>
    );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, data: { ...prev.data, [name]: value } }));
  };

  const handleChangeAvatar = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          data: { ...prev.data, avatar: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    }

    e.target.value = ""; // Reset file input
  };

  const handleSave = async () => {
    if (!isEditing) return;

    setLoading(true);

    await editUser(profile.data?.name, profile.data?.email /* profile.data?.avatar */);

    setLoading(false);
    setIsEditing(false);
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
            <Button onClick={handleSave} className="gap-2" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {t("page.save")}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="gap-2 bg-transparent"
              disabled={loading}
            >
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
                <AvatarImage
                  src={profile.data?.avatar || "/placeholder.svg"}
                  alt={profile.data?.name}
                />
                <AvatarFallback>{profile.data?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {/* {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    id="avatar-upload"
                    style={{ display: "none" }}
                    onChange={handleChangeAvatar}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("avatar-upload").click()}
                    className="cursor-pointer"
                    disabled={loading}
                  >
                    {t("sections.personal.avatar")}
                  </Button>
                </>
              )} */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-id">{t("sections.personal.id")}</Label>
                <div className="flex items-center gap-2">
                  {/* <Hash className="h-4 w-4 text-muted-foreground" /> */}
                  <Input
                    id="user-id"
                    value={profile.data?.principal}
                    readOnly
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="join-date">{t("sections.personal.joinDate")}</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input id="join-date" value={profile.data?.first_connection} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">{t("sections.personal.name")}</Label>
                <Input
                  id="name"
                  name="name"
                  value={profile.data?.name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("sections.personal.email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.data?.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {profile.data?.community && (
              <div className="space-y-2">
                <Label htmlFor="community">{t("sections.personal.community")}</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{profile.data?.community}</Badge>
                </div>
              </div>
            )}
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
                <span className="font-semibold">{profile.data?.completed_tx}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">
                    {t("sections.stats.positive")}
                  </span>
                </div>
                <span className="font-semibold text-green-600">
                  {profile.data?.positive_reviews}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-muted-foreground">
                    {t("sections.stats.negative")}
                  </span>
                </div>
                <span className="font-semibold text-red-600">{profile.data?.negative_reviews}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("sections.stats.successRate")}
                </span>
                <Badge variant="outline" className="text-green-600">
                  {Math.round(
                    (profile.data?.positive_reviews /
                      (profile.data?.positive_reviews + profile.data?.negative_reviews)) *
                      100
                  ) || 0}
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
