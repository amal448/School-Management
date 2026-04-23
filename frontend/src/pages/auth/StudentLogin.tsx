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
        <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
            
            {/* ── Background Image (Matching Hero Section) ── */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://media.gettyimages.com/id/171306436/photo/red-brick-high-school-building-exterior.jpg?s=612x612&w=gi&k=20&c=8to_zwGxxcI1iYcix7DhmWahoDTlaqxEMzumDwJtxeg=')`,
                }}
            />

            {/* ── Dark overlay layers (Matching Hero Section) ── */}
            <div className="absolute inset-0 z-10 bg-[#060606]/20" />
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#060606]/90 via-[#060606]/60 to-[#060606]/30" />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#060606]/80 via-transparent to-transparent" />

            {/* ── Content (Card remains white) ── */}
            <div className="relative z-20 w-full max-w-[400px]">

                <div
                    className="w-full rounded-xl border overflow-hidden shadow-2xl"
                    style={{
                        background: '#ffffff', // Explicitly White
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: '0.5px',
                    }}
                >
                    {/* Top accent line */}

                    <div className="px-8 pt-8 pb-7 flex flex-col gap-6">

                        {/* Logo + school name */}
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl flex items-center justify-center bg-primary shrink-0">
                                <GraduationCap className="size-5 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-sm leading-tight text-slate-950">
                                    School MS
                                </p>
                                <p className="text-xs text-slate-500">
                                    Student portal
                                </p>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Sign in</h1>
                            <p className="text-xs text-slate-500 mt-1">
                                Enter your credentials to continue
                            </p>
                        </div>

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

                        <form onSubmit={handleCredentialLogin} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={emailPlaceholder}
                                        className="pl-9 h-10 text-sm border-slate-200 focus:ring-slate-950"
                                        value={email}
                                        onChange={handleEmailChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                                    <Input
                                        id="password"
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
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                                    >
                                        {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 mt-2 bg-primary hover:bg-slate-800 text-white transition-all"
                                disabled={loading}
                            >
                                {loading ? <Spinner /> : 'Sign in'}
                            </Button>
                        </form>

                        <p className="text-center text-xs text-slate-400">
                            Access restricted to authorised accounts only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentLoginPage