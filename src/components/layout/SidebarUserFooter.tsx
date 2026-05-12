import { Link } from 'react-router'
import { UserIcon, MoonIcon, SunIcon, SignOutIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { useLogout } from '@/hooks/useAuth'

const roleLabel: Record<string, string> = {
  admin: 'Quản trị viên',
  editor: 'Biên tập viên',
}

interface SidebarUserFooterProps {
  isCollapsed: boolean
}

export function SidebarUserFooter({ isCollapsed }: SidebarUserFooterProps) {
  const user = useAuthStore((s) => s.user)
  const { theme, toggleTheme } = useThemeStore()
  const { mutate: logout } = useLogout()

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'AD'

  const avatar = (
    <Avatar className="h-8 w-8 shrink-0 cursor-pointer">
      <AvatarImage src={user?.avatarUrl} alt={user?.displayName} />
      <AvatarFallback className="text-xs font-semibold bg-sidebar-avatar-bg text-sidebar-avatar-text">
        {initials}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-3 px-3 py-2.5 rounded w-full transition-colors hover:brightness-110 text-sidebar-nav-text-active"
        >
          {avatar}
          {!isCollapsed && (
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate text-sidebar-nav-text-active">
                {user?.displayName ?? 'Admin'}
              </p>
              <p className="text-xs truncate text-sidebar-nav-text">
                {roleLabel[user?.role ?? ''] ?? user?.role}
              </p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="w-52 mb-1">
        <DropdownMenuLabel className="font-normal">
          <p className="font-medium text-sm">{user?.displayName}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
            <UserIcon size={16} />
            Trang cá nhân
          </Link>
        </DropdownMenuItem>

        {/* Dark mode toggle — không đóng dropdown khi click */}
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="flex items-center justify-between cursor-pointer"
          onClick={toggleTheme}
        >
          <span className="flex items-center gap-2">
            {theme === 'dark'
              ? <MoonIcon size={16} />
              : <SunIcon size={16} />
            }
            {theme === 'dark' ? 'Giao diện tối' : 'Giao diện sáng'}
          </span>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
            onClick={(e) => e.stopPropagation()}
            aria-label="Toggle dark mode"
          />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => logout()}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <SignOutIcon size={16} />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
