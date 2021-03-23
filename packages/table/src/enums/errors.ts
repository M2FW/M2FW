export const Errors: { [key: string]: string } = {
  CannotDeleteRow: `Can't delete row`,
}

// BAD_INPUT
// PATTERN_MISMATCH
// RANGE_OVERFLOW
// RANG_UNDERFLOW
// STEP_MISMATCH
// TOO_LONG
// TOO_SHORT
// TYPE_MISMATCH
// VALUE_MISSING
type ValidityErrorTypes = 'VALUE_MISSING' | 'RANGE_OVERFLOW' | 'RANGE_UNDERFLOW' | 'PATTERN_MISMATCH'

export const ValidityErrors: Record<ValidityErrorTypes, string> = {
  VALUE_MISSING: '반드시 값을 입력해 주세요',
  RANGE_OVERFLOW: '입력한 값이 범위를 초과 했습니다',
  RANGE_UNDERFLOW: '입력한 값이 범위에 미달 됩니다',
  PATTERN_MISMATCH: '올바른 형식의 값을 입력해 주세요',
}
