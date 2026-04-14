import { SendFirstTimeSetupEmailInput, SendOtpEmailInput, SendResetPasswordEmailInput } from "src/application/use-cases/interfaces/inputs"

export interface IEmailService {
  sendOtp(input: SendOtpEmailInput):                     Promise<void>
  sendFirstTimeSetup(input: SendFirstTimeSetupEmailInput): Promise<void>
  sendResetPassword(input: SendResetPasswordEmailInput):   Promise<void>
}