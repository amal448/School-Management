export interface TokenPayload {
  userId:    string
  email:     string
  role:      string
  sessionId?: string
}

export interface TokenPair {
  accessToken:  string
  refreshToken: string
}

export interface ITokenService {
  generateTokenPair(payload: TokenPayload): TokenPair
  verifyAccessToken(token: string):         TokenPayload
  verifyRefreshToken(token: string):        TokenPayload
  decodeToken(token: string):               TokenPayload | null
}