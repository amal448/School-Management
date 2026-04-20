// src/pages/auth/AdminManagerLoginPage.tsx

import {
  GraduationCap, Eye, EyeOff, Mail, Lock,
  ChevronDown, AlertCircle, ShieldAlert,
} from 'lucide-react'
import { Button }    from '@/components/ui/button'
import { Input }     from '@/components/ui/input'
import { Label }     from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAdminManagerLogin }    from '@/hooks/auth/useAdminManagerLogin'
import { Link }                    from 'react-router-dom'
import { ROUTES }                  from '@/config/routes.config'
import { ADMIN_ROLE_OPTIONS, ERROR_MESSAGES } from '@/constants/auth'
import { GoogleIcon, Spinner }     from '@/components/shared/Helpercomponents'

export default function AdminManagerLoginPage() {
  const {
    email, password, showPassword, loading, googleLoading,
    error, selectedRole, currentRoleLabel, emailPlaceholder,
    handleRoleChange, handleEmailChange, handlePasswordChange,
    toggleShowPassword, handleCredentialLogin, handleGoogleLogin,
  } = useAdminManagerLogin()

  const isAdmin = selectedRole === 'ADMIN'

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--color-background-tertiary)' }}
    >
      <div className="w-full max-w-[400px]">

        {/* ── Card ── */}
        <div
          className="w-full rounded-xl border overflow-hidden"
          style={{
            background:   'var(--color-background-primary)',
            borderColor:  'var(--color-border-tertiary)',
            borderWidth:  '0.5px',
          }}
        >
          {/* Top accent line */}
          <div className="h-0.5 w-full bg-foreground" />

          <div className="px-8 pt-8 pb-7 flex flex-col gap-6">

            {/* ── Logo + school name ── */}
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'hsl(var(--foreground))' }}
              >
                <GraduationCap className="size-5 text-background" />
              </div>
              <div>
                <p className="font-medium text-sm leading-tight">
                  St. Xavier's Academy
                </p>
                <p className="text-xs text-muted-foreground">
                  Staff portal
                </p>
              </div>
            </div>

            {/* ── Heading ── */}
            <div>
              <h1 className="text-lg font-medium">Sign in</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Select your role to continue
              </p>
            </div>

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
              <Label className="text-xs text-muted-foreground">Role</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-9 font-normal text-sm"
                  >
                    <span>{currentRoleLabel}</span>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width)">
                  {ADMIN_ROLE_OPTIONS.map((role) => (
                    <DropdownMenuItem
                      key={role.value}
                      onClick={() => handleRoleChange(role.value)}
                    >
                      {role.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* ── Admin — Google only ── */}
            {isAdmin && (
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full gap-3 h-10"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  type="button"
                >
                  {googleLoading ? <Spinner /> : <GoogleIcon />}
                  Continue with Google
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Admin accounts use Google Sign-In only.
                </p>
              </div>
            )}

            {/* ── Manager / Teacher — email + password ── */}
            {!isAdmin && (
              <>
                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground shrink-0">
                    email &amp; password
                  </span>
                  <Separator className="flex-1" />
                </div>

                <form
                  onSubmit={handleCredentialLogin}
                  className="flex flex-col gap-4"
                >
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="am-email" className="text-xs text-muted-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input
                        id="am-email"
                        type="email"
                        placeholder={emailPlaceholder}
                        className="pl-9 h-9 text-sm"
                        value={email}
                        onChange={handleEmailChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="am-password" className="text-xs text-muted-foreground">
                        Password
                      </Label>
                      <Link
                        to={ROUTES.AUTH.FORGOT_PASSWORD + '?role=MANAGER'}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                      <Input
                        id="am-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-9 pr-10 h-9 text-sm"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword
                          ? <EyeOff className="size-3.5" />
                          : <Eye    className="size-3.5" />
                        }
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 mt-1"
                    disabled={loading}
                  >
                    {loading
                      ? <Spinner />
                      : `Sign in as ${currentRoleLabel}`
                    }
                  </Button>
                </form>
              </>
            )}

            {/* ── Footer ── */}
            <p className="text-center text-xs text-muted-foreground">
              Restricted to authorised accounts only
              <span className="mx-2 opacity-40">·</span>
              <Link
                to={ROUTES.AUTH.STUDENT_LOGIN ?? '/login'}
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Student login
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}