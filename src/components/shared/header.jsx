import ConnectButton from "./connect-button";
import LanguageSelector from "./language-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="justify-between border-b bg-background !p-4 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="hidden sm:block">
          <h1 className="text-3xl font-semibold">PayPeer</h1>
        </div>
      </div>

      <section className="flex items-center gap-4">
        <LanguageSelector />
        <ConnectButton />
        <ThemeToggle />
      </section>
    </header>
  );
}
