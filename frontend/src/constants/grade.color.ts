
export const gradeColor = (grade: string) => {
  if (['A+', 'A'].includes(grade))
    return 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
  if (['B+', 'B'].includes(grade))
    return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
  if (grade === 'C')
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
  if (grade === 'D')
    return 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400'
  if (grade === 'AB')
    return 'bg-muted text-muted-foreground'
  return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
}
