import {
    GraduationCap, Eye, EyeOff, Mail, Lock,
    AlertCircle, ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ERROR_MESSAGES } from '@/constants/auth'
import { Spinner } from '@/components/shared/Helpercomponents'
import { useStudentLogin } from '@/hooks/auth/useStudentLogin'

const StudentLoginPage = () => {

    const {
        email, password, showPassword, loading, error, emailPlaceholder,
        handleEmailChange, handlePasswordChange, toggleShowPassword, handleCredentialLogin
    } = useStudentLogin()

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: 'var(--color-background-tertiary)' }}
        >
            <div className="w-full max-w-[400px]">

                {/* ── Card ── */}
                <div
                    className="w-full rounded-xl border overflow-hidden"
                    style={{
                        background: 'var(--color-background-primary)',
                        borderColor: 'var(--color-border-tertiary)',
                        borderWidth: '0.5px',
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
                                    Student portal
                                </p>
                            </div>
                        </div>

                        {/* ── Heading ── */}
                        <div>
                            <h1 className="text-lg font-medium">Sign in</h1>
                            <p className="text-xs text-muted-foreground mt-1">
                                Enter your credentials to continue
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
                                    {ERROR_MESSAGES[error as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.UNKNOWN}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* ── Form ── */}
                        <form
                            onSubmit={handleCredentialLogin}
                            className="flex flex-col gap-4"
                        >
                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="email" className="text-xs text-muted-foreground">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                    <Input
                                        id="email"
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
                                <Label htmlFor="password" className="text-xs text-muted-foreground">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                    <Input
                                        id="password"
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
                                            : <Eye className="size-3.5" />
                                        }
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-10 mt-1"
                                disabled={loading}
                            >
                                {loading ? <Spinner /> : 'Sign in'}
                            </Button>
                        </form>

                        {/* ── Footer ── */}
                        <p className="text-center text-xs text-muted-foreground">
                            Access restricted to authorised accounts only.
                        </p>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default StudentLoginPage