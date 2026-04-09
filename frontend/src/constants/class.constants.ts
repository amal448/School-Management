export const CLASS_GROUPS = [
  { label: 'Primary',   classes: ['1', '2', '3', '4', '5'] },
  { label: 'Middle',    classes: ['6', '7', '8']            },
  { label: 'Secondary', classes: ['9', '10', '11', '12']    },
] as const

export const SECTIONS = ['A', 'B', 'C', 'D', 'E'] as const

export const getGroupLabel = (className: string): string => {
  for (const group of CLASS_GROUPS) {
    if ((group.classes as readonly string[]).includes(className)) {
      return group.label
    }
  }
  return ''
}
export const getTeacherLevel = (grade: string): string => {
  const g = Number(grade)
  if (g <= 5)  return 'primary'
  if (g <= 8)  return 'middle'
  if (g <= 10) return 'secondary'
  return 'higher_secondary'
}