import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Wallet } from "lucide-react";
import { shortP } from "@/lib/parsers";
import { useAuth } from "@/hooks/use-auth";

export default function ConnectButton() {
  const { login, disconnect, principal } = useAuth();

  if (principal.loading) return <Button disabled>Loading...</Button>;

  if (principal.data)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>{shortP(principal.data)}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link to="/app/profile" className="w-full">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnect} variant="destructive">
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

  return (
    <Button className="gap-2 cursor-pointer" onClick={login}>
      <Wallet className="h-4 w-4" />
      Connect
    </Button>
  );
}
