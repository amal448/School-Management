import { Badge } from '@/components/ui/badge'
import { TopperResponse } from '@/types/topper.types'

export const AchieverCard = ({ topper }: { topper: TopperResponse }) => (
  <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
    {topper.photoUrl ? (
      <img
        src={topper.photoUrl}
        alt={topper.name}
        className="w-16 h-16 rounded-full object-cover border-2 border-yellow-200"
      />
    ) : (
      <div className="w-16 h-16 rounded-full bg-yellow-50 border-2 border-yellow-200 flex items-center justify-center text-xl font-bold text-yellow-600">
        {topper.name.charAt(0)}
      </div>
    )}

    <div>
      <p className="text-sm font-semibold text-slate-900 leading-tight">
        {topper.name}
      </p>
      {topper.department && (
        <p className="text-xs text-slate-400 mt-0.5">{topper.department}</p>
      )}
    </div>

    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      <Badge variant="secondary" className="text-xs">
        {topper.marks}/{topper.totalMarks}
      </Badge>
      <Badge className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200">
        {Math.round((topper.marks / topper.totalMarks) * 100)}%
      </Badge>
    </div>

    <span className="text-xs text-slate-400">
      {topper.rank === 1 ? '🥇' : topper.rank === 2 ? '🥈' : topper.rank === 3 ? '🥉' : `#${topper.rank}`}
      {' '}Rank {topper.rank}
    </span>
  </div>
)
