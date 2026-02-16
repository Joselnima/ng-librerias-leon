import { useState, useRef, useCallback, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  type PaperProps,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material"
import {
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  DragIndicator as DragIcon,
} from "@mui/icons-material"

import Draggable from "react-draggable"

import { ModalProps } from "./modal-dialog.interface"

// Componente Paper draggable
function DraggablePaper(props: PaperProps & { handle?: string }) {
  const nodeRef = useRef<HTMLDivElement>(null)

  return (
    <Draggable
      nodeRef={nodeRef}
      handle={props.handle || ".drag-handle"}
      cancel={'[class*="MuiDialogContent-root"]'}
      bounds="parent"
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  )
}

// Función para convertir width a estilos CSS
const getWidthStyles = (width: ModalProps["width"]) => {
  if (!width || width === "auto") return {}

  if (typeof width === "string") {
    const breakpoints = {
      xs: "444px",
      sm: "600px",
      md: "900px",
      lg: "1200px",
      xl: "1536px",
    }

    if (width in breakpoints) {
      return { maxWidth: breakpoints[width as keyof typeof breakpoints] }
    }

    return { width, maxWidth: width }
  }

  if (typeof width === "number") {
    return { width: `${width}px`, maxWidth: `${width}px` }
  }

  if (typeof width === "object" && width !== null) {
    return {
      minWidth: width.min ? (typeof width.min === "number" ? `${width.min}px` : width.min) : undefined,
      maxWidth: width.max ? (typeof width.max === "number" ? `${width.max}px` : width.max) : undefined,
    }
  }

  return {}
}

// Función para convertir height a estilos CSS
const getHeightStyles = (height: ModalProps["height"]) => {
  if (!height || height === "auto") return {}

  if (typeof height === "string") {
    return { height, maxHeight: height }
  }

  if (typeof height === "number") {
    return { height: `${height}px`, maxHeight: `${height}px` }
  }

  if (typeof height === "object" && height !== null) {
    return {
      minHeight: height.min ? (typeof height.min === "number" ? `${height.min}px` : height.min) : undefined,
      maxHeight: height.max ? (typeof height.max === "number" ? `${height.max}px` : height.max) : undefined,
    }
  }

  return {}
}

export const ModalDialog: React.FC<ModalProps> = ({
  open,
  onClose,
  isFullscreen: initialFullscreen = false,
  draggable = false,
  showFullscreenButton = false,
  title,
  headerTemplate,
  content,
  footerContent,
  width = "sm",
  height = "auto",
  children,
  disableEscapeKeyDown = false,
  disableBackdropClick = false,
  maxWidth = "sm",
  fullWidth = false,
  className,
  onFullscreenToggle,
  ...props
}: ModalProps) => {

  const [internalFullscreen, setInternalFullscreen] = useState(initialFullscreen)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.between("sm", "md"))

  const shouldForceFullscreen = isMobile
  const isFullscreenMode = shouldForceFullscreen || initialFullscreen || internalFullscreen

  useEffect(() => {
    if (initialFullscreen !== undefined) {
      setInternalFullscreen(initialFullscreen)
    }
  }, [initialFullscreen])

  const handleFullscreenToggle = useCallback(() => {
    if (shouldForceFullscreen) return

    const newFullscreen = !isFullscreenMode
    setInternalFullscreen(newFullscreen)
    onFullscreenToggle?.(newFullscreen)
  }, [isFullscreenMode, onFullscreenToggle, shouldForceFullscreen])

  const handleClose = useCallback(
    (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
      if (reason === "backdropClick" && disableBackdropClick) return
      if (reason === "escapeKeyDown" && disableEscapeKeyDown) return
      onClose()
    },
    [onClose, disableBackdropClick, disableEscapeKeyDown],
  )

  const widthStyles = getWidthStyles(width)
  const heightStyles = getHeightStyles(height)

  const paperStyles = {
    ...widthStyles,
    ...heightStyles,
    ...(isFullscreenMode && {
      width: "100vw",
      height: "100vh",
      maxWidth: "100vw",
      maxHeight: "100vh",
      margin: 0,
      borderRadius: 0,
    }),
  }

  const PaperComponent = draggable && !isFullscreenMode && !isMobile ? DraggablePaper : Paper

  const shouldShowFullscreenButton = showFullscreenButton && !shouldForceFullscreen && !initialFullscreen

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isFullscreenMode}
      maxWidth={isFullscreenMode ? false : maxWidth}
      fullWidth={fullWidth}
      PaperComponent={PaperComponent}
      PaperProps={{
        style: paperStyles,
        className: className,
        ...(draggable &&
          !isFullscreenMode &&
          !isMobile && {
          handle: ".drag-handle",
        }),
      }}
      {...props}
    >
      {(title || headerTemplate || shouldShowFullscreenButton || draggable) && (
        <DialogTitle
          className={`${draggable && !isFullscreenMode && !isMobile ? "drag-handle cursor-move" : ""}`}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            borderBottom: "1px solid",
            borderColor: "divider",
            ...(draggable &&
              !isFullscreenMode &&
              !isMobile && {
              cursor: "move",
              userSelect: "none",
            }),
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            {draggable && !isFullscreenMode && !isMobile && <DragIcon sx={{ mr: 1, color: "text.secondary" }} />}
            {headerTemplate || <span style={{ fontSize: "1.25rem", fontWeight: 500 }}>{title}</span>}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {shouldShowFullscreenButton && (
              <IconButton onClick={handleFullscreenToggle} size="small" sx={{ color: "text.secondary" }}>
                {isFullscreenMode ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            )}
            <IconButton onClick={() => onClose()} size="small" sx={{ color: "text.secondary" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
      )}

      <DialogContent
        sx={{
          padding: "16px",
          paddingTop: "16px !important",
          overflow: "auto",
          ...(isFullscreenMode && { flex: 1 }),
        }}
      >
        {content}
        {children}
      </DialogContent>

      {footerContent && (
        <DialogActions
          sx={{
            padding: "16px",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          {footerContent}
        </DialogActions>
      )}
    </Dialog>
  )

}

export default ModalDialog;