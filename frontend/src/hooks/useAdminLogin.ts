import { useState } from 'react'
import { ROLES } from '@/constants'
import {
    type AuthError,
    type AdminManagerRole,
    ADMIN_ROLE_OPTIONS,
} from '@/constants/auth'
import { useGoogleOAuth } from '@/lib/googleAuth'

export function useAdminLogin() {

    // ── State ──────────────────────────────────────────
    const [selectedRole, setSelectedRole] = useState<AdminManagerRole>(ROLES.ADMIN)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState<AuthError>(null)

    // ── Derived ────────────────────────────────────────
    const currentRoleLabel = ADMIN_ROLE_OPTIONS.find(
        (r) => r.value === selectedRole
    )?.label ?? ''

    const emailPlaceholder = selectedRole === ROLES.ADMIN
        ? 'admin@school.com'
        : 'manager@school.com'

    // ── Handlers ───────────────────────────────────────
    const handleRoleChange = (role: AdminManagerRole) => {
        setSelectedRole(role)
        setError(null)
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        setError(null)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        setError(null)
    }

    const toggleShowPassword = () => setShowPassword((prev) => !prev)

    const handleCredentialLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            // TODO: replace with real auth service call
            // const res = await authService.adminLogin({ email, password, role: selectedRole })
            // if (res.is_first_time) navigate(ROUTES.AUTH.ADMIN_SET_PASSWORD)
            // else navigate(ROUTES.AUTH.ADMIN_VERIFY_OTP)
            console.log({ email, password, role: selectedRole })
        } catch {
            setError('INVALID_CREDENTIALS')
        } finally {
            setLoading(false)
        }
    }

    // ── Google OAuth — trigger lives in googleAuth.ts ──
    const triggerGoogleLogin = useGoogleOAuth({
        selectedRole,
        setError,
        setGoogleLoading,
        onSuccess: async (accessToken, role) => {
            setGoogleLoading(true)
            try {
                console.log({ accessToken, role })
                // TODO: send to backend
                // const res = await authService.googleLogin({ accessToken, role })
                // if (res.is_first_time) navigate(ROUTES.AUTH.ADMIN_SET_PASSWORD)
                // else navigate(ROUTES.AUTH.ADMIN_VERIFY_OTP)
            } catch {
                setError('NOT_WHITELISTED')
            } finally {
                setGoogleLoading(false)
            }
        },
    })


    const handleGoogleLogin = async () => {
        setError(null)
        setGoogleLoading(true)
        triggerGoogleLogin()
    }

    return {
        // state
        selectedRole,
        email,
        password,
        showPassword,
        loading,
        googleLoading,
        error,

        // derived
        currentRoleLabel,
        emailPlaceholder,

        // handlers
        handleRoleChange,
        handleEmailChange,
        handlePasswordChange,
        toggleShowPassword,
        handleCredentialLogin,
        handleGoogleLogin,
    }
}