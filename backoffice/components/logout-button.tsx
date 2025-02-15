import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <Button
      variant="ghost"
      className="p-0 hover:bg-red-500 hover:text-white transition-colors">
    </Button>
  );
}
