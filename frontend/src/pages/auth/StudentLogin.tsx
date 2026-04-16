import {
    GraduationCap, Eye, EyeOff, Mail, Lock,
    AlertCircle, ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ERROR_MESSAGES } from '@/constants/auth'
import { Spinner } from '@/components/shared/Helpercomponents'
import { useStudentLogin } from '@/hooks/auth/useStudentLogin'

const StudentLoginPage = () => {

    const { email, password, showPassword, loading, error, emailPlaceholder,
        handleEmailChange, handlePasswordChange, toggleShowPassword, handleCredentialLogin
    } = useStudentLogin()

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
                        <p className="text-sm  mt-0.5 text-white">Student Portal</p>
                    </div>
                </div>
                <Card className="shadow-sm">


                    <CardContent className="flex flex-col gap-4">
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
                        <>
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
                                    {loading ? <Spinner /> : `Login`}

                                </Button>
                            </form>
                        </>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <p className="text-xs text-center text-muted-foreground w-full">
                            Access restricted to authorised accounts only.
                        </p>
                    </CardFooter>
                </Card>


            </div>
        </div>
    )
}

export default StudentLoginPage