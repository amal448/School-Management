// src/infrastructure/services/google-oauth.service.ts
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { GoogleAuthUseCase } from 'src/application/use-cases/auth/google-auth.use-case'

export function configureGoogleOAuth(googleAuthUseCase: GoogleAuthUseCase): void {
  passport.use(
    new GoogleStrategy(
      {
        clientID:         process.env.GOOGLE_CLIENT_ID!,
        clientSecret:     process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL:      process.env.GOOGLE_CALLBACK_URL!,
        // Pass req so we can access res in the verify callback
        passReqToCallback: true,
      },
      async (req, _accessToken, _refreshToken, profile, done) => {
        try {
          // res is available via req.res in express
          const res = (req as any).res

          const result = await googleAuthUseCase.execute(
            {
              googleId:  profile.id,
              email:     profile.emails![0].value,
              firstName: profile.name?.givenName  ?? '',
              lastName:  profile.name?.familyName ?? '',
              avatar:    profile.photos?.[0].value,
            },
            res,
          )
          done(null, result)
        } catch (err) {
          done(err as Error, undefined)
        }
      },
    ),
  )
}