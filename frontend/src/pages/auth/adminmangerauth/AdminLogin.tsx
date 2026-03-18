import { GraduationCap, Eye, EyeOff, Mail, Lock, ChevronDown, AlertCircle, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ADMIN_ROLE_OPTIONS, ERROR_MESSAGES } from '@/constants/auth'
import { useAdminLogin } from '@/hooks/useAdminLogin'

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4 shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const Spinner = () => (
  <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
)

const AdminLogin = () => {
  const {
    email,
    password,
    showPassword,
    loading,
    googleLoading,
    error,
    currentRoleLabel,
    emailPlaceholder,
    handleRoleChange,
    handleEmailChange,
    handlePasswordChange,
    toggleShowPassword,
    handleCredentialLogin,
    handleGoogleLogin,
  } = useAdminLogin()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* ── Brand ── */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="size-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">SchoolMS</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Staff Portal</p>
          </div>
        </div>

        {/* ── Card ── */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign in</CardTitle>
            <CardDescription>Select your role and sign in to continue</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">

            {/* ── Error alert ── */}
            {error && (
              <Alert variant="destructive" className="py-3">
                {error === 'ACCOUNT_BLOCKED'
                  ? <ShieldAlert className="size-4" />
                  : <AlertCircle className="size-4" />
                }
                <AlertDescription className="text-xs">
                  {ERROR_MESSAGES[error]}
                </AlertDescription>
              </Alert>
            )}

            {/* ── Role selector ── */}
            <div className="flex flex-col gap-1.5">
              <Label>Role</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-10 font-normal">
                    <span className="capitalize">{currentRoleLabel}</span>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
                  {ADMIN_ROLE_OPTIONS.map((role) => (
                    <DropdownMenuItem
                      key={role.value}
                      onClick={() => handleRoleChange(role.value)}
                      className="capitalize"
                    >
                      {role.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* ── Google SSO ── */}
            <Button
              variant="outline"
              className="w-full gap-3 h-11"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              type="button"
            >
              {googleLoading ? <Spinner /> : <GoogleIcon />}
              Continue with Google
            </Button>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground shrink-0">or sign in with email</span>
              <Separator className="flex-1" />
            </div>

            {/* ── Credentials form ── */}
            <form onSubmit={handleCredentialLogin} className="flex flex-col gap-4">

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={emailPlaceholder}
                    className="pl-9"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/admin/forgot-password"
                    className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-9 pr-10"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 cursor-pointer" disabled={loading}>
                {loading ? <Spinner /> : `Sign in as ${currentRoleLabel}`}
              </Button>

            </form>

          </CardContent>

          <CardFooter className="pt-0">
            <p className="text-xs text-center text-muted-foreground w-full">
              Access restricted to whitelisted accounts only.
            </p>
          </CardFooter>
        </Card>

        {/* ── Staff login link ── */}
        <p className="text-center text-xs text-muted-foreground">
          Teacher or Student?{' '}
          <a href="/login" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Staff login
          </a>
        </p>

      </div>
    </div>
  )
}

export default AdminLogin