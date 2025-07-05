import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

const languageOptions = [
  { language: "English", code: "en" },
  { language: "Spanish", code: "es" },
];

const LanguageSelector = () => {
  // Set the initial language from i18next's detected or default language
  const [language, setLanguage] = useState(i18next.language);
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n && (document.body.dir = i18n?.dir());
  }, [i18n, i18n.language]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Globe /> {language?.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languageOptions.map(({ language, code }) => (
          <DropdownMenuItem
            key={language}
            onClick={() => {
              setLanguage(code);
              i18next.changeLanguage(code);
            }}
          >
            {language}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
