import React from "react";
import moment, { Moment } from "moment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { esES } from "@mui/x-date-pickers/locales";

type InputDateProps = {
  label?: string;
  value?: string | Date | Moment | null;
  size?: "small" | "medium";
  variant?: "outlined" | "standard" | "filled";
  onChange: (v: string | null) => void;
  minDate?: any;
  maxDate?: any;
  disabled?: boolean;
  errorText?: string | null;
};

export const InputDate: React.FC<InputDateProps> = ({
  label,
  value,
  size = "medium",
  variant = "outlined",
  onChange,
  minDate,
  maxDate,
  disabled,
  errorText,
}) => {
  // Estado para mostrar "Fecha inválida"
  const [isInvalid, setIsInvalid] = React.useState(false);

  // Ref para evitar llamadas redundantes a onChange que provoquen loops
  const lastNormalizedRef = React.useRef<string | null>(null);

  // Normalizar cualquier value inicial/externo a "YYYY-MM-DDT00:00:00"
  React.useEffect(() => {
    if (value === null || value === undefined) return;

    // Intentamos obtener la representación normalizada:
    let normalized: string | null = null;

    // 1) Si es Date object
    if (value instanceof Date) {
      if (!isNaN(value.getTime())) {
        normalized = moment(value).format("YYYY-MM-DD") + "T00:00:00";
      } else {
        // Date inválida
        normalized = null;
      }
    }
    // 2) Si es Moment
    else if (moment.isMoment(value)) {
      const m = value as Moment;
      if (m.isValid()) {
        normalized = m.format("YYYY-MM-DD") + "T00:00:00";
      } else {
        normalized = null;
      }
    }
    // 3) Si es string
    else if (typeof value === "string") {
      // Si ya está en formato ISO local YYYY-MM-DDTHH:mm:ss (o con T00:00:00)
      const isoMatch = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
      const ymdMatch = /^\d{4}-\d{2}-\d{2}$/.test(value);

      if (isoMatch) {
        // Lo dejamos tal cual (normalizamos fecha parte a T00:00:00 para comparar)
        // Truncamos/normalizamos horas a 00:00:00 para nuestro estándar
        const m = moment(value);
        if (m.isValid()) normalized = m.format("YYYY-MM-DD") + "T00:00:00";
        else normalized = null;
      } else if (ymdMatch) {
        normalized = value + "T00:00:00";
      } else {
        // Intentar parsear cualquier string reconocible por moment (ej "Mon Dec 01 2025 ...")
        const m = moment(value);
        if (m.isValid()) normalized = m.format("YYYY-MM-DD") + "T00:00:00";
        else normalized = null;
      }
    } else {
      // tipo desconocido -> no hacemos nada
      normalized = null;
    }

    // Si no pudimos normalizar, marcamos inválido y no llamamos onChange
    if (normalized === null) {
      setIsInvalid(true);
      return;
    }

    // Evitar llamadas repetidas: solo llamar onChange si normalized difiere de lo que
    // ya tenemos (sea string o Date convertido)
    // Si value es string y ya coincide con normalized → NO llamar
    const valueAsNormalizedString =
      typeof value === "string"
        ? // si viene como string pero no es ISO completo, convertirlo para comparar
        (() => {
          const m = moment(value);
          return m.isValid() ? m.format("YYYY-MM-DD") + "T00:00:00" : value;
        })()
        : // si viene Date o Moment, produce su string
        moment(value).isValid()
          ? moment(value).format("YYYY-MM-DD") + "T00:00:00"
          : null;

    // Si el valor normalizado coincide con el último que normalizamos, no llamar
    if (valueAsNormalizedString && lastNormalizedRef.current === valueAsNormalizedString) {
      // ya lo normalizamos antes
      setIsInvalid(false);
      return;
    }

    // Si el value ya es string igual a normalized → no llamar onChange
    if (typeof value === "string" && value === normalized) {
      lastNormalizedRef.current = normalized;
      setIsInvalid(false);
      return;
    }

    // Llamar onChange solo si normalized es distinto al valor actual string
    // Esto convertirá Date|Moment|otros strings a nuestro formato estándar
    lastNormalizedRef.current = normalized;
    setIsInvalid(false);
    onChange(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); // depende solo de value para evitar loops

  // internalValue para DatePicker (Moment or null)
  const internalValue = React.useMemo(() => {
    if (!value) return null;
    // Si value es string normalizado "YYYY-MM-DDT00:00:00" -> parsearlo
    if (typeof value === "string") {
      const m = moment(value, moment.ISO_8601, true);
      if (m.isValid()) return m;
      // fallback: try loose parse
      const m2 = moment(value);
      return m2.isValid() ? m2 : null;
    }
    if (value instanceof Date) {
      const m = moment(value);
      return m.isValid() ? m : null;
    }
    if (moment.isMoment(value)) {
      return value.isValid() ? value : null;
    }
    return null;
  }, [value]);

  // onChange del DatePicker -> enviamos string normalizado o null
  const handleChange = (newValue: Moment | null) => {
    if (newValue && newValue.isValid()) {
      const formatted = newValue.format("YYYY-MM-DD") + "T00:00:00";
      lastNormalizedRef.current = formatted; // evitar que el effect nos re-normalice
      setIsInvalid(false);
      onChange(formatted);
    } else {
      lastNormalizedRef.current = null;
      setIsInvalid(true);
      onChange(null);
    }
  };

  // onError solo marca inválido, sin dejar que DatePicker ponga helper duplicado
  const handleError = (reason: unknown) => {
    setIsInvalid(Boolean(reason));
  };

  React.useEffect(() => {
    moment.locale("es");
  }, []);

  return (
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      adapterLocale="es"
      localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <DatePicker
        label={label}
        value={internalValue}
        onChange={handleChange}
        onError={handleError}
        format="DD/MM/YYYY"
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        slotProps={{
          textField: {
            fullWidth: true,
            size,
            variant: variant as any,
            label,
            disabled,
            error: Boolean(errorText || isInvalid),
            helperText: errorText || (isInvalid ? "Fecha inválida" : " "),
            InputLabelProps: { shrink: true }
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default InputDate;
