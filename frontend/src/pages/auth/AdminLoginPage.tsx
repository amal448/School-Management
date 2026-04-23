import {
  GraduationCap, Eye, EyeOff, Mail, Lock,
  ChevronDown, AlertCircle, ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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

export default function AdminManagerLoginPage() {
  const {
    email, password, showPassword, loading, googleLoading,
    error, selectedRole, currentRoleLabel, emailPlaceholder,
    handleRoleChange, handleEmailChange, handlePasswordChange,
    toggleShowPassword, handleCredentialLogin, handleGoogleLogin,
  } = useAdminManagerLogin()

  const isAdmin = selectedRole === 'ADMIN'

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      
      {/* ── Background Image (Matching Hero/Student Login) ── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://media.gettyimages.com/id/171306436/photo/red-brick-high-school-building-exterior.jpg?s=612x612&w=gi&k=20&c=8to_zwGxxcI1iYcix7DhmWahoDTlaqxEMzumDwJtxeg=')`,
        }}
      />

      {/* ── Dark overlay layers ── */}
      <div className="absolute inset-0 z-10 bg-[#060606]/20" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#060606]/90 via-[#060606]/60 to-[#060606]/30" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#060606]/80 via-transparent to-transparent" />

      <div className="relative z-20 w-full max-w-[400px]">

        {/* ── Card (White Background) ── */}
        <div
          className="w-full rounded-xl border overflow-hidden shadow-2xl"
          style={{
            background: '#ffffff', // Forced White
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: '0.5px',
          }}
        >
          {/* Top accent line - Slate/Black */}

          <div className="px-8 pt-8 pb-7 flex flex-col gap-6">

            {/* ── Logo + school name ── */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl flex items-center justify-center bg-primary shrink-0">
                <GraduationCap className="size-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight text-slate-950">
                  School MS
                </p>
                <p className="text-xs text-slate-500">
                  Staff portal
                </p>
              </div>
            </div>

            {/* ── Heading ── */}
            <div>
              <h1 className="text-xl font-bold text-slate-900">Sign in</h1>
              <p className="text-xs text-slate-500 mt-1">
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
                  {ERROR_MESSAGES[error] || "An unexpected error occurred"}
                </AlertDescription>
              </Alert>
            )}

            {/* ── Role selector ── */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-slate-700">Role</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-10 font-normal text-sm border-slate-200"
                  >
                    <span className="text-slate-900">{currentRoleLabel}</span>
                    <ChevronDown className="size-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-(--radix-dropdown-menu-trigger-width) bg-white">
                  {ADMIN_ROLE_OPTIONS.map((role) => (
                    <DropdownMenuItem
                      key={role.value}
                      className="cursor-pointer"
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
                  className="w-full gap-3 h-11 border-slate-200 hover:bg-slate-50"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  type="button"
                >
                  {googleLoading ? <Spinner /> : <GoogleIcon />}
                  <span className="text-slate-900">Continue with Google</span>
                </Button>
                <p className="text-center text-xs text-slate-500">
                  Admin accounts use Google Sign-In only.
                </p>
              </div>
            )}

            {/* ── Manager / Teacher — email + password ── */}
            {!isAdmin && (
              <>
                <div className="flex items-center gap-3">
                  <Separator className="flex-1 bg-slate-200" />
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider shrink-0">
                    Credentials
                  </span>
                  <Separator className="flex-1 bg-slate-200" />
                </div>

                <form
                  onSubmit={handleCredentialLogin}
                  className="flex flex-col gap-4"
                >
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="am-email" className="text-xs font-semibold text-slate-700">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                      <Input
                        id="am-email"
                        type="email"
                        placeholder={emailPlaceholder}
                        className="pl-9 h-10 text-sm border-slate-200 focus:ring-slate-950"
                        value={email}
                        onChange={handleEmailChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="am-password" className="text-xs font-semibold text-slate-700">
                        Password
                      </Label>
                      <Link
                        to={ROUTES.AUTH.FORGOT_PASSWORD + '?role=MANAGER'}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-950 transition-colors underline underline-offset-4"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                      <Input
                        id="am-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-9 pr-10 h-10 text-sm border-slate-200 focus:ring-slate-950"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950"
                      >
                        {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 mt-1 bg-primary hover:bg-slate-800 text-white"
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
            <div className="space-y-4">
              <Separator className="bg-slate-100" />
              <p className="text-center text-[11px] text-slate-400 leading-relaxed">
                Restricted to authorised accounts only
                <br />
                <Link
                  to={ROUTES.AUTH.STUDENT_LOGIN ?? '/login'}
                  className="inline-block mt-2 font-semibold text-slate-600 underline underline-offset-4 hover:text-slate-950 transition-colors"
                >
                  Switch to Student login
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}