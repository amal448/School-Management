import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Trash2 } from 'lucide-react'
import { useRemoveCommonSubject, useRemoveSectionLanguage } from '@/hooks/exam/useExams'
import { ExamResponse, GradeConfig } from '@/types/exam.types'
import { AddCommonSubjectDialog } from '@/components/exam/AddCommonSubjectDialog'
import { AddSectionLanguageDialog } from '@/components/exam/AddSectionLanguageDialog'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

export const GradeConfigPanel = ({
  exam,
  examId,
  gradeConfig,
  isDraft,
  resolveSubject,
  resolveClass,
}: {
  exam: ExamResponse,
  examId: string,
  gradeConfig: GradeConfig
  isDraft: boolean
  resolveSubject: (id: string) => string
  resolveClass: (id: string) => string
}) => {
  const removeSubject = useRemoveCommonSubject(examId)
  const removeLang = useRemoveSectionLanguage(examId)

  return (
    <Card key={gradeConfig.grade}>
      <CardHeader className="pb-0 pt-5 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Grade {gradeConfig.grade}
          </CardTitle>
          {isDraft && (
            <div className="flex gap-2">
              <AddCommonSubjectDialog
                exam={exam}
                gradeConfig={gradeConfig}
              />
              <AddSectionLanguageDialog
                exam={exam}
                gradeConfig={gradeConfig}
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-5 mt-4 flex flex-col gap-4">

        {/* Common subjects */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Common subjects — all sections
          </p>
          {!gradeConfig.commonSubjects.length ? (
            <p className="text-xs text-muted-foreground">
              No subjects added yet.
            </p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    {['Subject', 'Date', 'Time', 'Marks', ''].map((h, i) => (
                      <th
                        key={i}
                        className={`
                          text-xs font-medium text-muted-foreground
                          uppercase tracking-wide px-4 py-2.5 text-left'}
                        `}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {gradeConfig.commonSubjects.map((s) => (
                    <tr key={s.subjectId}>
                      <td className="px-4 py-2.5 text-sm font-medium">
                        {resolveSubject(s.subjectId)}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">
                        {new Date(s.examDate).toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short',
                        })}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {s.startTime}–{s.endTime}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">
                        {s.passingMarks}/{s.totalMarks}
                      </td>
                      <td className="px-4 py-2.5 text-left">
                        {isDraft && (
                          <ConfirmDialog
                            trigger={
                              <button className="text-destructive hover:text-destructive/80 transition-colors">
                                <Trash2 className="size-3.5" />
                              </button>
                            }
                            title="Remove subject"
                            description={`Remove ${resolveSubject(s.subjectId)} from Grade ${gradeConfig.grade}?`}
                            confirmLabel="Remove"
                            onConfirm={() => removeSubject.mutate({
                              grade: gradeConfig.grade,
                              subjectId: s.subjectId,
                            })}
                            isPending={removeSubject.isPending}
                            variant="destructive"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section languages */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Section languages — additional
          </p>
          {!gradeConfig.sectionLanguages.length ? (
            <p className="text-xs text-muted-foreground">
              No section languages added.
            </p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    {['Section', 'Language', 'Date', 'Time', ''].map((h, i) => (
                      <th
                        key={i}
                        className={`
                          text-xs font-medium text-muted-foreground
                          uppercase tracking-wide px-4 py-2.5 text-left'}
                        `}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {gradeConfig.sectionLanguages.map((l) => (
                    <tr key={l.classId}>
                      <td className="px-4 py-2.5 text-sm font-medium">
                        {resolveClass(l.classId)}
                      </td>
                      <td className="px-4 py-2.5 text-sm">
                        {resolveSubject(l.subjectId)}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">
                        {new Date(l.examDate).toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short',
                        })}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">
                        {l.startTime}–{l.endTime}
                      </td>
                      <td className="px-4 py-2.5 text-left">
                        {isDraft && (
                          <ConfirmDialog
                            trigger={
                              <button className="text-destructive hover:text-destructive/80 transition-colors">
                                <Trash2 className="size-3.5" />
                              </button>
                            }
                            title="Remove language"
                            description={`Remove language for ${resolveClass(l.classId)}?`}
                            confirmLabel="Remove"
                            onConfirm={() => removeLang.mutate({
                              grade: gradeConfig.grade,
                              classId: l.classId,
                            })}
                            isPending={removeLang.isPending}
                            variant="destructive"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  )
}
