import React, { useState, useRef, useEffect, useCallback } from "react"
import { IMaskInput } from "react-imask"
import { useTheme } from "@mui/material";
import { CalendarMonth, ChevronLeft, ChevronRight, ExpandMore, ExpandLess } from "@mui/icons-material";
import type { InputDateRangeProps } from "./interface/input-date-range-props.interface";
import type { DateFormat, Variant, Size, CalendarView } from "./types/input-date-range.type";

const getMaskConfig = (format: DateFormat) => {
    const isYearFirst = format.startsWith("YYYY")
    const separator = format.includes("-") ? "-" : "/"
    return {
        mask: isYearFirst ? `0000${separator}00${separator}00` : `00${separator}00${separator}0000`,
        lazy: false,
    }
}

const getMaskPattern = (format: DateFormat): string => format.toLowerCase()

const parseDate = (dateString: string, format: DateFormat): string | null => {
    const parts = dateString.replace(/\D/g, "")
    if (parts.length < 8) return null

    let day: number, month: number, year: number

    if (format.startsWith("DD")) {
        day = Number.parseInt(parts.substring(0, 2))
        month = Number.parseInt(parts.substring(2, 4))
        year = Number.parseInt(parts.substring(4, 8))
    } else if (format.startsWith("MM")) {
        month = Number.parseInt(parts.substring(0, 2))
        day = Number.parseInt(parts.substring(2, 4))
        year = Number.parseInt(parts.substring(4, 8))
    } else {
        year = Number.parseInt(parts.substring(0, 4))
        month = Number.parseInt(parts.substring(4, 6))
        day = Number.parseInt(parts.substring(6, 8))
    }

    if (month < 1 || month > 12 || day < 1 || day > 31) return null

    const date = new Date(year, month - 1, day)
    if (date.getMonth() !== month - 1 || date.getDate() !== day) return null

    // Format as yyyy-MM-ddT00:00:00
    const yyyy = String(year).padStart(4, "0")
    const mm = String(month).padStart(2, "0")
    const dd = String(day).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}T00:00:00`
}

const formatDateFromIso = (isoString: string | null, format: DateFormat): string => {
    if (!isoString) return ""
    const date = new Date(isoString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const sep = format.includes("-") ? "-" : "/"

    if (format.startsWith("DD")) return `${day}${sep}${month}${sep}${year}`
    if (format.startsWith("MM")) return `${month}${sep}${day}${sep}${year}`
    return `${year}${sep}${month}${sep}${day}`
}

const isoToDate = (isoString: string | null): Date | null => (isoString ? new Date(isoString) : null)

const dateToLocalIso = (date: Date): string => {
    const yyyy = String(date.getFullYear()).padStart(4, "0")
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}T00:00:00`
}

const getCalendarDays = (date: Date): (number | null)[] => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: (number | null)[] = Array(firstDay).fill(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
}

const getWeekDays = (locale = "en-US"): string[] => {
    const baseDate = new Date(Date.UTC(2024, 0, 7)) // Comienza en un domingo
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" })
    return [...Array(7)].map((_, i) => {
        const date = new Date(baseDate)
        date.setUTCDate(baseDate.getUTCDate() + i)
        return formatter.format(date)
    })
}

const getYearsGrid = (centerYear: number): number[] => {
    const startYear = centerYear - 7
    return Array.from({ length: 16 }, (_, i) => startYear + i)
}

const SIZE_STYLES = {
    small: { fontSize: "0.875rem", height: "2.25rem" },
    medium: { fontSize: "1rem", height: "2.75rem" },
    large: { fontSize: "1.125rem", height: "3rem" },
}

const LABEL_SIZES = {
    small: "0.75rem",
    medium: "0.875rem",
    large: "1rem",
}

export const InputDateRangePicker = React.forwardRef<HTMLDivElement, InputDateRangeProps>(
    (
        {
            value = { startDate: null, endDate: null },
            onChange,
            minDate,
            maxDate,
            disabled = false,
            errorText,
            label,
            variant = "outline",
            size = "medium",
            dateFormat = "MM/DD/YYYY",
            locale = "en-US", // Nueva propiedad con valor predeterminado
        },
        ref,
    ) => {

        const theme = useTheme();

        const [isOpen, setIsOpen] = useState(false)
        const [isFocused, setIsFocused] = useState(false)
        const [currentMonth, setCurrentMonth] = useState(new Date())
        const [startInputValue, setStartInputValue] = useState("")
        const [endInputValue, setEndInputValue] = useState("")
        const [hoveredDay, setHoveredDay] = useState<number | null>(null)
        const [calendarView, setCalendarView] = useState<CalendarView>("days")
        const [yearGridCenter, setYearGridCenter] = useState(new Date().getFullYear())

        const containerRef = useRef<HTMLDivElement>(null)
        const endInputRef = useRef<HTMLInputElement>(null)
        const startInputRef = useRef<HTMLInputElement>(null)

        useEffect(() => {
            setStartInputValue(formatDateFromIso(value.startDate, dateFormat))
        }, [value.startDate, dateFormat])

        useEffect(() => {
            setEndInputValue(formatDateFromIso(value.endDate, dateFormat))
        }, [value.endDate, dateFormat])

        useEffect(() => {
            if (isOpen) {
                setCalendarView("days")
                setYearGridCenter(currentMonth.getFullYear())
            }
        }, [isOpen, currentMonth])

        const maskLength = getMaskConfig(dateFormat).mask.length

        const getContainerStyles = useCallback(
            (focused: boolean): React.CSSProperties => {
                const base: React.CSSProperties = {
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "0.75rem",
                    paddingRight: "0.75rem",
                    gap: "0.5rem",
                    transition: "all 0.2s",
                }

                if (variant === "outline") {
                    return { ...base }
                }

                if (variant === "filled") {
                    return {
                        ...base,
                        borderBottom: `${isFocused ? '2' : '1'}px solid ${focused ? theme.palette.primary.main : theme.palette.grey[400]}`,
                        borderTopLeftRadius: "0.25rem",
                        borderTopRightRadius: "0.25rem",
                        backgroundColor: theme.palette.action.selected,
                        paddingTop: "1.25rem",
                    }
                }

                return {
                    ...base,
                    borderBottom: `${isFocused ? '2' : '1'}px solid ${focused ? theme.palette.primary.main : theme.palette.grey[400]}`,
                    paddingTop: "1.25rem",
                }
            },
            [variant],
        )

        const handleStartAccept = useCallback(
            (maskedValue: string) => {
                setStartInputValue(maskedValue)

                if (maskedValue.length === maskLength) {
                    const parsed = parseDate(maskedValue, dateFormat)
                    if (parsed) {
                        const dateObj = new Date(parsed)
                        if ((minDate && dateObj < minDate) || (maxDate && dateObj > maxDate)) return
                        setCurrentMonth(dateObj);
                        onChange?.({ startDate: parsed, endDate: value.endDate })
                        setTimeout(() => endInputRef.current?.focus(), 10)
                    }
                } else if (maskedValue.replace(/\D/g, "") === "") {
                    onChange?.({ startDate: null, endDate: value.endDate })
                }
            },
            [dateFormat, maskLength, minDate, maxDate, onChange, value.endDate],
        )

        const handleEndAccept = useCallback(
            (maskedValue: string) => {
                setEndInputValue(maskedValue)

                if (maskedValue.length === maskLength) {
                    const parsed = parseDate(maskedValue, dateFormat)
                    if (parsed) {
                        const dateObj = new Date(parsed)
                        if ((minDate && dateObj < minDate) || (maxDate && dateObj > maxDate)) return
                        setCurrentMonth(dateObj);
                        onChange?.({ startDate: value.startDate, endDate: parsed })
                    }
                } else if (maskedValue.replace(/\D/g, "") === "") {
                    onChange?.({ startDate: value.startDate, endDate: null })
                }
            },
            [dateFormat, maskLength, minDate, maxDate, onChange, value.startDate],
        )

        const handleDateSelect = (day: number) => {
            const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            if ((minDate && newDate < minDate) || (maxDate && newDate > maxDate)) return

            const isoString = dateToLocalIso(newDate)
            const startDateObj = isoToDate(value.startDate)
            const endDateObj = isoToDate(value.endDate)

            // If no start date OR both dates are set, start fresh with new start date
            if (!startDateObj || (startDateObj && endDateObj)) {
                onChange?.({ startDate: isoString, endDate: null })
                return
            }

            if (startDateObj && !endDateObj) {
                if (newDate < startDateObj) {
                    onChange?.({ startDate: isoString, endDate: dateToLocalIso(startDateObj) })
                } else {
                    onChange?.({ startDate: value.startDate, endDate: isoString })
                }

                setIsOpen(false)

                return
            }
        }

        const handleYearSelect = (year: number) => {
            setCurrentMonth(new Date(year, currentMonth.getMonth(), 1))
            setCalendarView("days")
        }

        const isDateInRange = (day: number): boolean => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            const startDate = isoToDate(value.startDate)
            const endDate = isoToDate(value.endDate)
            return !!(startDate && endDate && date > startDate && date < endDate)
        }

        const isDateStart = (day: number): boolean => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            return isoToDate(value.startDate)?.toDateString() === date.toDateString()
        }

        const isDateEnd = (day: number): boolean => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            return isoToDate(value.endDate)?.toDateString() === date.toDateString()
        }

        const isDateDisabled = (day: number): boolean => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            return !!((minDate && date < minDate) || (maxDate && date > maxDate))
        }

        const isHoveredRange = (day: number): boolean => {
            const start = isoToDate(value.startDate)
            const end = isoToDate(value.endDate)

            // Only show hover when we have start but no end
            if (!start || end || !hoveredDay) return false

            const hoverDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), hoveredDay)
            const current = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

            // Handle both directions
            if (hoverDate >= start) {
                return current > start && current <= hoverDate
            } else {
                return current >= hoverDate && current < start
            }
        }

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                    setIsOpen(false)
                    setIsFocused(false)
                }
            }
            document.addEventListener("mousedown", handleClickOutside)
            return () => document.removeEventListener("mousedown", handleClickOutside)
        }, [])

        const calendarDays = getCalendarDays(currentMonth)
        const weekDays = getWeekDays(locale)
        const yearsGrid = getYearsGrid(yearGridCenter)

        const inputStyle: React.CSSProperties = {
            ...SIZE_STYLES[size],
            backgroundColor: "transparent",
            outline: "none",
            border: "0",
            flex: 1,
            color: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.common.black,
            fontWeight: 500,
        }

        const inputsContent = (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    width: "100%",
                }}
            >
                <IMaskInput
                    inputRef={startInputRef}
                    mask={getMaskConfig(dateFormat).mask}
                    lazy={false}
                    inputMode="numeric"
                    value={startInputValue}
                    onAccept={handleStartAccept}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => !isOpen && setIsFocused(false)}
                    placeholder={isFocused ? getMaskPattern(dateFormat) : ""}
                    disabled={disabled}
                    style={{
                        ...inputStyle,
                        textAlign: "center"
                    }}
                />

                <span style={{ color: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.common.black, fontWeight: 500 }}>-</span>

                <IMaskInput
                    inputRef={endInputRef}
                    mask={getMaskConfig(dateFormat).mask}
                    lazy={false}
                    inputMode="numeric"
                    value={endInputValue}
                    onAccept={handleEndAccept}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => !isOpen && setIsFocused(false)}
                    placeholder={isFocused ? getMaskPattern(dateFormat) : ""}
                    disabled={disabled}
                    style={{
                        ...inputStyle,
                        textAlign: "center"
                    }}
                />


                <CalendarMonth
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        if (!disabled) setIsOpen(!isOpen)
                    }}
                    style={{
                        width: size === "small" ? "1rem" : size === "medium" ? "1.25rem" : "1.5rem",
                        height: size === "small" ? "1rem" : size === "medium" ? "1.25rem" : "1.5rem",
                        flexShrink: 0,
                        cursor: disabled ? "not-allowed" : "pointer",
                    }}
                />
            </div>
        )

        const calendarContent = isOpen && !disabled && (
            <div
                style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    marginTop: "0.5rem",
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: "0.5rem",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                    zIndex: 999999,
                    padding: "1rem",
                    minWidth: "280px",
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <button
                        onClick={() => {
                            if (calendarView === "days") {
                                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                            } else {
                                setYearGridCenter((prev) => prev - 16)
                            }
                        }}
                        style={{
                            padding: "0.25rem",
                            borderRadius: "0.375rem",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            border: "none",
                        }}
                    >
                        <ChevronLeft style={{ width: "1.25rem", height: "1.25rem", color: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.common.black }} />
                    </button>

                    <button
                        onClick={() => setCalendarView(calendarView === "days" ? "years" : "days")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            textAlign: "center",
                            fontWeight: 600,
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1rem",
                            color: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.common.black,
                        }}
                    >
                        {calendarView === "days"
                            ? currentMonth.toLocaleString(locale, { month: "long", year: "numeric" }) // Usamos locale aquí
                            : `${yearsGrid[0]} - ${yearsGrid[yearsGrid.length - 1]}`}

                        {calendarView === "days" ? (
                            <ExpandMore style={{ width: "1rem", height: "1rem", color: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.common.black }} />
                        ) : (
                            <ExpandLess style={{ width: "1rem", height: "1rem", color: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.common.black }} />
                        )}
                    </button>

                    <button
                        onClick={() => {
                            if (calendarView === "days") {
                                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                            } else {
                                setYearGridCenter((prev) => prev + 16)
                            }
                        }}
                        style={{
                            padding: "0.25rem",
                            borderRadius: "0.375rem",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            border: "none",
                        }}
                    >
                        <ChevronRight style={{ width: "1.25rem", height: "1.25rem", color: theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.common.black }} />
                    </button>
                </div>

                {calendarView === "years" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                        {yearsGrid.map((year) => {
                            const isSelected = year === currentMonth.getFullYear()
                            return (
                                <button
                                    key={year}
                                    onClick={() => handleYearSelect(year)}
                                    style={{
                                        padding: "0.5rem",
                                        borderRadius: "2rem",
                                        fontSize: "0.875rem",
                                        fontWeight: isSelected ? 600 : 400,
                                        backgroundColor: isSelected ? theme.palette.primary.main : "transparent",
                                        color: isSelected ? "#fff" : theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.common.black,
                                        border: "none",
                                        cursor: "pointer",
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {year}
                                </button>
                            )
                        })}
                    </div>
                )}

                {calendarView === "days" && (
                    <>
                        <div
                            style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem", marginBottom: "0.5rem" }}
                        >
                            {weekDays.map((day) => (
                                <div
                                    key={day}
                                    style={{
                                        width: "2rem",
                                        height: "2rem",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: theme.palette.mode === "dark" ? theme.palette.grey[400] : theme.palette.grey[600],
                                    }}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem" }}>
                            {calendarDays.map((day, index) => {
                                if (!day) return <div key={index} />

                                const isDisabled = isDateDisabled(day)
                                const isStart = isDateStart(day)
                                const isEnd = isDateEnd(day)
                                const inRange = isDateInRange(day)
                                const hovered = isHoveredRange(day)

                                let bgColor = theme.palette.background.default
                                let textColor = isDisabled ? theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[400] : theme.palette.mode === "dark" ? theme.palette.grey[300] : theme.palette.common.black

                                if (isStart) {
                                    bgColor = theme.palette.primary.main // Blue for start
                                    textColor = theme.palette.common.white
                                } else if (isEnd) {
                                    bgColor = theme.palette.mode === "dark" ? "#0F766E" : "#14B8A6"  // Teal for end
                                    textColor = theme.palette.common.white
                                } else if (inRange) {
                                    bgColor = theme.palette.mode === "dark" ? "#1E40AF" : "#DBEAFE"
                                } else if (hovered) {
                                    bgColor = theme.palette.mode === "dark" ? "#3B82F6" : "#E0ECFF"
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleDateSelect(day)}
                                        disabled={isDisabled}
                                        onMouseEnter={() => !isDisabled && setHoveredDay(day)}
                                        onMouseLeave={() => setHoveredDay(null)}
                                        style={{
                                            width: "2rem",
                                            height: "2rem",
                                            borderRadius: "50%",
                                            fontSize: "0.875rem",
                                            fontWeight: isStart || isEnd ? 700 : 500,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: isDisabled ? "not-allowed" : "pointer",
                                            backgroundColor: bgColor,
                                            color: textColor,
                                            border: "none",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        {day}
                                    </button>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>
        )

        return (

            <div ref={ref || containerRef} style={{ position: "relative" }}>
                {variant === "outline" ? (
                    <fieldset
                        style={{
                            border: `${isFocused ? 2 : 1}px solid ${isFocused ? theme.palette.primary.main : theme.palette.grey[700]}`,
                            borderRadius: "0.5rem",
                            margin: 0,
                            padding: 0,
                            transition: "border-color 0.2s",
                            opacity: disabled ? 0.5 : 1,
                        }}
                    >
                        {label && (
                            <legend
                                style={{
                                    marginLeft: "0.5rem",
                                    padding: "0 0.25rem",
                                    fontSize: LABEL_SIZES[size],
                                    fontWeight: 500,
                                    color: isFocused ? theme.palette.primary.main : theme.palette.grey[700],
                                    transition: "color 0.2s",
                                }}
                            >
                                {label}
                            </legend>
                        )}
                        <div
                            style={{
                                ...getContainerStyles(isFocused),
                                cursor: disabled ? "not-allowed" : "text",
                            }}
                        >
                            {inputsContent}
                        </div>
                    </fieldset>
                ) : (
                    <div style={{ position: "relative" }}>
                        {label && (
                            <label
                                style={{
                                    position: "absolute",
                                    left: "0.75rem",
                                    top: "0.25rem",
                                    fontSize: LABEL_SIZES[size],
                                    fontWeight: 500,
                                    color: isFocused ? theme.palette.primary.main : theme.palette.grey[600],
                                    transition: "color 0.2s",
                                    zIndex: 1,
                                    pointerEvents: "none",
                                }}
                            >
                                {label}
                            </label>
                        )}
                        <div
                            style={{
                                ...getContainerStyles(isFocused),
                                opacity: disabled ? 0.5 : 1,
                                cursor: disabled ? "not-allowed" : "text",
                            }}
                        >
                            {inputsContent}
                        </div>
                    </div>
                )}

                {/* Error component */}
                {errorText && (
                    <span
                        style={{
                            display: "block",
                            color: theme.palette.error.main,
                            fontSize: "0.75rem",
                            marginTop: "0.25rem",
                            marginLeft: "14px",
                        }}
                    >
                        {errorText}
                    </span>
                )}

                {calendarContent}
            </div>
        )
    },
)

export default InputDateRangePicker