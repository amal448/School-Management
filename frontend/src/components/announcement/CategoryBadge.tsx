import { AnnouncementCategory, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/announcement.types'

export const CategoryBadge = ({ category }: { category: AnnouncementCategory}) => (
  <span style={{
    background:    `${CATEGORY_COLORS[category]}20`,
    color:         CATEGORY_COLORS[category],
    fontSize:      10,
    fontWeight:    600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding:       '3px 8px',
    borderRadius:  4,
  }}>
    {CATEGORY_LABELS[category]}
  </span>
)
