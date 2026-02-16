import type { DateFormat, Size, Variant } from "../types/input-date-range.type";

export interface InputDateRangeProps {
    value?: { startDate: string | null; endDate: string | null }
    onChange?: (dates: { startDate: string | null; endDate: string | null }) => void
    minDate?: Date
    maxDate?: Date
    disabled?: boolean
    errorText?: string
    label?: string
    variant?: Variant
    size?: Size
    dateFormat?: DateFormat
    locale?: string
}