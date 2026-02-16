import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Typography } from "@mui/material";
import { EditorProps } from "./interface/editor.interface";

export const Editor: React.FC<EditorProps> = ({
    value,
    onChange,
    label,
    errorText,
}: EditorProps) => {

    const modules = {
        toolbar: [
            [{ font: [] }, { size: [] }],
            ["bold", "italic", "underline", "strike"],
            ["script", "super"],
            [{ color: [] }, { background: [] }],
            [{ header: 1 }, { header: 2 }, { header: 3 }, { header: 4 }, { header: 5 }, { header: 6 }, "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link", "image", "video", "table"],
            ["clean"],
        ],
    };

    const formats = [
        "font", "size",
        "bold", "italic", "underline", "strike",
        "script", "super",
        "color", "background",
        "header", "blockquote",
        "list", "bullet",
        "align",
        "link", "image", "video", "table",
        "clean",
    ];

    return (
        <div style={{ marginBottom: "1rem" }}>
            {label && (
                <label
                    style={{
                        fontWeight: "bold",
                        display: "block",
                        marginBottom: "0.5rem",
                    }}
                >
                    {label}
                </label>
            )}
            <ReactQuill
                value={value}
                onChange={onChange}
                theme="snow"
                modules={modules}
                formats={formats}
            />
            {errorText && (
                <Typography
                    color="error"
                    variant="caption"
                    style={{ marginTop: "0.5rem", display: "block" }}
                >
                    {errorText}
                </Typography>
            )}
        </div>
    );
};

export default Editor;