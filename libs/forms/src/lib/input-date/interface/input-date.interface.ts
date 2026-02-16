export interface DatePickerFieldProps {
    /**
     * Optional label for the field (used as the MUI TextField label).
     */
    label?: string;

    /**
     * Current value of the field. Can be Date, string, number or null.
     */
    value: Date | string | number | null;

    /**
     * Handler called when the value changes.
     * Receives: raw Date object, transformed string value, and a boolean indicating whether transformation was done.
     */
    onChange: (value: Date | null, transformedValue: string | null, casting: boolean) => void;

    /**
     * Optional minimum selectable date.
     */
    minDate?: Date;

    /**
     * Optional maximum selectable date.
     */
    maxDate?: Date;

    /**
     * Format used for displaying the date. Defaults to 'dd/MM/yyyy'.
     */
    dateFormat?: string;

    /**
     * Whether the field is disabled.
     */
    disabled?: boolean;

    /**
     * Optional text to display when there's an error.
     * If provided, will trigger error state and show the message.
     */
    errorText?: string;

}