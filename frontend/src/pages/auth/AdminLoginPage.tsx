import {
  GraduationCap, Eye, EyeOff, Mail, Lock,
  ChevronDown, AlertCircle, ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAdminManagerLogin } from '@/hooks/auth/useAdminManagerLogin'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/routes.config'
import { ADMIN_ROLE_OPTIONS, ERROR_MESSAGES } from '@/constants/auth'
import { GoogleIcon, Spinner } from '@/components/shared/Helpercomponents'

const AdminManagerLoginPage = () => {
  const { email, password, showPassword, loading, googleLoading, error, selectedRole, currentRoleLabel, emailPlaceholder,
    handleRoleChange, handleEmailChange, handlePasswordChange, toggleShowPassword, handleCredentialLogin, handleGoogleLogin,
  } = useAdminManagerLogin()

  const isAdmin = selectedRole === 'ADMIN'
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Standard smooth & light background image (Modern Education/Architecture) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop')" }}
      />
      {/* Light frosted glass overlay to ensure the form remains perfectly readable */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-0" />

      <div className="w-full max-w-sm flex flex-col gap-6 relative z-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="size-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">SchoolMS</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Staff Portal</p>
          </div>
        </div>
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign in</CardTitle>
            <CardDescription>Select your role and sign in to continue</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
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
            <div className="flex flex-col gap-1.5">
              <Label>Role</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 font-normal"
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
            {isAdmin && (
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
            )}
            {!isAdmin && (
              <>
                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground shrink-0">
                    Sign in with email
                  </span>
                  <Separator className="flex-1" />
                </div>

                <form
                  onSubmit={handleCredentialLogin}
                  className="flex flex-col gap-4"
                >
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
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to={ROUTES.AUTH.FORGOT_PASSWORD + '?role=MANAGER'}
                        className="text-xs text-muted-foreground underline-offset-4 hover:underline hover:text-foreground transition-colors"
                      >
                        Forgot password?
                      </Link>
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
                        {showPassword
                          ? <EyeOff className="size-4" />
                          : <Eye className="size-4" />
                        }
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={loading}
                  >
                    {loading ? <Spinner /> : `Sign in as ${currentRoleLabel}`}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-xs text-center text-muted-foreground w-full">
              Access restricted to authorised accounts only.
            </p>
          </CardFooter>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          Teacher or Student?{' '}
          <Link
            to={ROUTES.AUTH.TEACHER_STUDENT_LOGIN}
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Staff login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default AdminManagerLoginPage