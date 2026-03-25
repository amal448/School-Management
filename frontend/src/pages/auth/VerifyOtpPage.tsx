import { Mail, AlertCircle } from 'lucide-react'
import { Link }              from 'react-router-dom'
import { Button }            from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input }             from '@/components/ui/input'
import { Label }             from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
// import { useVerifyOtp }      from '@/hooks/auth/useVerifyOtp'
import { ERROR_MESSAGES }    from '@/constants/auth'
import { ROUTES }            from '@/config/routes.config'
import { useVerifyOtp } from '@/hooks/auth/useVerifyOtp'
import { Spinner } from '@/components/shared/Helpercomponents'

const VerifyOtpPage = () => {
  const {email, otp, error, loading, handleOtpChange, handleSubmit} = useVerifyOtp()

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">Session expired.</p>
          <Link
            to={ROUTES.AUTH.ADMIN_MANAGER_LOGIN}
            className="text-sm underline underline-offset-4 mt-2 block"
          >
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">

        {/* Brand */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="size-12 rounded-xl bg-primary flex items-center justify-center">
            <Mail className="size-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Check your email</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              We sent a 6-digit code to
            </p>
            <p className="text-sm font-medium">{email}</p>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Enter OTP</CardTitle>
            <CardDescription>
              Code expires in 10 minutes
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {error && (
                <Alert variant="destructive" className="py-3">
                  <AlertCircle className="size-4" />
                  <AlertDescription className="text-xs">
                    {ERROR_MESSAGES[error]}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="otp">One-time password</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  className="text-center text-lg tracking-widest font-mono"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading || otp.length !== 6}
              >
                {loading ? <Spinner /> : 'Verify OTP'}
              </Button>

            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Didn't receive the code?{' '}
          <Link
            to={ROUTES.AUTH.ADMIN_MANAGER_LOGIN}
            className="underline underline-offset-4 hover:text-foreground"
          >
            Try again
          </Link>
        </p>

      </div>
    </div>
  )
}

export default VerifyOtpPage