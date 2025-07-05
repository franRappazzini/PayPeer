import { Button } from "@/components/ui/button";
import LanguageSelector from "../language-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Wallet } from "lucide-react";

export function Header() {
  return (
    <header className="justify-between border-b bg-background px-4 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold">PayPeer</h1>
        </div>
      </div>

      <section className="flex items-center gap-4">
        <LanguageSelector />
        <Button className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect
        </Button>
      </section>
    </header>
  );
}
