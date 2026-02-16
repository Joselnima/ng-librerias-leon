export interface HTMLLoadingElement extends HTMLDivElement {
    present: () => Promise<HTMLLoadingElement>;
    dismiss: () => Promise<boolean>;
}