"use client";

import React, { useState } from 'react';
import { useDropzone, Accept, FileRejection } from 'react-dropzone';

// Components MUI
import {
    Box,
    Typography,
    FormHelperText,
    IconButton,
    Tooltip,
} from '@mui/material';

import { useTheme as useMuiTheme } from "@mui/material/styles";

import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

// Component's Lion
// import { FilePreviewDialog } from '@lion/ui';

// Services
// import { AlertService } from '@lion/shared';

// Interfaces:
import { DropzoneProps } from './interface/dropzone.interface';


export const Dropzone: React.FC<DropzoneProps> = ({
    label = 'Arrastra y suelta un archivo aquí, o haz clic para seleccionar',
    errorText = '',
    accept = '*/*',
    multiple = false,
    maxFiles = 1,
    maxSize = 10485760,
    disabled = false,
    value,
    onChange
}) => {

    const muiTheme = useMuiTheme();
    const isDark = muiTheme.palette.mode === "dark";

    const alertSvc = new AlertService();

    const normalizeAccept = (accept?: Accept | string | string[]): Accept | undefined => {
        if (!accept) return undefined;
        if (typeof accept === 'string') return { [accept]: [] };
        if (Array.isArray(accept)) {
            return accept.reduce((acc, type) => {
                acc[type] = [];
                return acc;
            }, {} as Accept);
        }
        return accept;
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (!ext) return 'assets/images/file.jpg';
        if (['pdf'].includes(ext)) return 'assets/images/pdf.jpg';
        if (['zip'].includes(ext)) return 'assets/images/zip.png';
        if (['txt'].includes(ext)) return 'assets/images/txt.png';
        if (['xls', 'xlsx'].includes(ext)) return 'assets/images/excel.jpg';
        if (['doc', 'docx'].includes(ext)) return 'assets/images/word.jpg';
        return 'assets/images/file.jpg';
    };

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<string | null>(null);
    const [previewName, setPreviewName] = useState<string | undefined>(undefined);

    const filesRaw = multiple ? (value as File[] || []) : value ? [value as File] : [];
    const files = filesRaw.filter((file: any) =>
        file && typeof file.name === 'string' && typeof file.size === 'number'
    );

    const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (rejectedFiles.length > 0) {
            rejectedFiles.forEach(({ file, errors }) => {
                errors.forEach(err => {
                    alertSvc.error(`${file.name}: ${err.message}`);
                });
            });
            return;
        }

        if (multiple) {
            const newFiles = [...((value as File[]) || []), ...acceptedFiles];
            const limitedFiles = newFiles.slice(0, maxFiles);
            if (onChange) onChange(limitedFiles);
        } else {
            if (onChange) onChange(acceptedFiles[0]);
        }
    };

    const removeFile = (index?: number) => {
        if (multiple && typeof index === 'number') {
            const updated = [...((value as File[]) || [])];
            updated.splice(index, 1);
            if (onChange) onChange(updated);
        } else {
            if (onChange) onChange(null);
        }
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        onDrop,
        accept: normalizeAccept(accept),
        multiple,
        maxSize,
        disabled,
        maxFiles,
    });

    return (
        <>
            <Box>
                <Box
                    {...getRootProps()}
                    sx={{
                        border: '2px dashed',
                        borderColor: isDragActive
                            ? muiTheme.palette.primary.main
                            : isDark
                                ? '#90caf9'
                                : '#2196F3',

                        backgroundColor: isDark ? '#1e1e1e' : '#fff',
                        color: isDark ? '#eee' : '#000',

                        padding: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        borderRadius: 2,
                        minHeight: 150,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: files.length === 0 ? 'center' : 'flex-start',
                        flexDirection: 'column',
                        position: 'relative',
                        gap: 2,
                    }}
                >
                    <input {...getInputProps()} />

                    {files.length === 0 && (
                        <Typography variant="body2" sx={{ pointerEvents: 'none' }}>
                            {isDragActive ? 'Suelta el archivo aquí...' : label}
                        </Typography>
                    )}

                    {files.length > 0 && (
                        <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
                            {files.map((file: File, index: number) => {
                                const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
                                const fileNameRaw = file.name;
                                const fileName = fileNameRaw.length > 20
                                    ? `${fileNameRaw.slice(0, 17)}...`
                                    : fileNameRaw;

                                const downloadFile = () => {
                                    const url = URL.createObjectURL(file);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = file.name;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                };

                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            width: 130,
                                            borderRadius: 2,
                                            boxShadow: 1,
                                            p: 1,
                                            backgroundColor: isDark ? '#2b2b2b' : '#fff',
                                            color: isDark ? '#ddd' : '#000',
                                            textAlign: 'center',
                                            border: `1px solid ${isDark ? '#555' : '#e0e0e0'}`,
                                            position: 'relative',
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 4,
                                                    right: 4,
                                                    zIndex: 3,
                                                    pointerEvents: 'auto',
                                                    color: isDark ? '#fff' : '#000',
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(multiple ? index : undefined);
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                        <Typography variant="body2" fontWeight="bold">
                                            {fileSizeMB} MB
                                        </Typography>

                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                mx: 'auto',
                                                my: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {file.type.startsWith('image/') ? (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'contain',
                                                        borderRadius: 4,
                                                    }}
                                                    onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                                />
                                            ) : (
                                                <img
                                                    src={getFileIcon(file.name)}
                                                    alt={file.name}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'contain',
                                                        borderRadius: 4,
                                                    }}
                                                    onError={(e) => {
                                                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        <Typography
                                            variant="caption"
                                            noWrap
                                            title={file.name}
                                        >
                                            {fileName}
                                        </Typography>

                                        <Box mt={1} display="flex" justifyContent="center" gap={1}>
                                            <Tooltip title="Descargar">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        downloadFile();
                                                    }}
                                                    sx={{
                                                        backgroundColor: isDark ? '#7b1fa2' : '#9c27b0',
                                                        color: '#fff',
                                                        '&:hover': {
                                                            backgroundColor: isDark ? '#4a148c' : '#7B1FA2',
                                                        },
                                                        pointerEvents: 'auto',
                                                    }}
                                                >
                                                    <DownloadIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            {(file.type.startsWith('image/') || file.type === 'application/pdf') && (
                                                <Tooltip title="Ver archivo">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const url = URL.createObjectURL(file);
                                                            setPreviewUrl(url);
                                                            setPreviewType(file.type);
                                                            setPreviewName(file.name);
                                                            setPreviewOpen(true);
                                                        }}
                                                        sx={{
                                                            backgroundColor: isDark ? '#1565c0' : '#2196F3',
                                                            color: '#fff',
                                                            '&:hover': {
                                                                backgroundColor: isDark ? '#0d47a1' : '#1565C0',
                                                            },
                                                            pointerEvents: 'auto',
                                                        }}
                                                    >
                                                        <span role="img" aria-label="Ver">👁️</span>
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </Box>

                {errorText && (
                    <FormHelperText error>{errorText}</FormHelperText>
                )}
            </Box>

            <FilePreviewDialog
                open={previewOpen}
                fileUrl={previewUrl}
                fileType={previewType}
                fileName={previewName}
                onClose={() => {
                    setPreviewOpen(false);
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                    setPreviewType(null);
                    setPreviewName(undefined);
                }}
            />
        </>
    );
};

export default Dropzone;