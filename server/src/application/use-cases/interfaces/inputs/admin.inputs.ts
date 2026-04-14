export interface WhitelistEmailInput {
  email: string
  role: 'admin' | 'manager'
  addedBy: string
  requesterId: string
}

export interface RemoveWhitelistInput {
  email: string
}

export interface UpdateAdminProfileInput {
  adminId: string
  firstName?: string
  lastName?: string
}
// ── Deactivate Admin ───────────────────────────────────
export interface DeactivateAdminInput {
  targetId: string;
  requesterId: string;
}
