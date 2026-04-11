import React from 'react'

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
    <div className="h-8 w-32 bg-muted rounded" />
    <div className="h-40 bg-muted rounded-xl" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-40 bg-muted rounded-xl" />
      ))}
    </div>
  </div>
  )
}

export default ProfileSkeleton