import Swal from "sweetalert2";

export const showAlert = (
    type: "info" | "success" | "warning" | "error" | "question",
    message: string,
    title?: string,
    useToast: boolean = false
) => {
    if (useToast) {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: type,
            title: title || "",
            text: message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    } else {
        Swal.fire({
            title: title || "Notification",
            text: message,
            icon: type,
            confirmButtonText: "OK",
        });
    }
};

export const showConfirmation = (
    title: string,
    message: string,
    confirmCallback: () => void
) => {
    Swal.fire({
        title,
        text: message,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
    }).then((result: any) => {
        if (result.isConfirmed) {
            confirmCallback();
        }
    });
};