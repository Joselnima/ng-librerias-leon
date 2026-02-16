import * as ReactDOM from 'react-dom/client';
import React from 'react';
import LoadingOverlay from '../LoadingOverlay';
import { HTMLLoadingElement } from '../interface/html-loading-element.interface';

export class LoadingController {
    create(message: string = 'Cargando...'): Promise<HTMLLoadingElement> {
        return new Promise((resolve) => {
            // Crear contenedor dinámico
            const container = document.createElement('div');

            document.body.appendChild(container);

            // React Root
            const root = ReactDOM.createRoot(container);

            const loadingElement = container as HTMLLoadingElement;

            // Método present()
            const present = (): Promise<HTMLLoadingElement> => {
                root.render(React.createElement(LoadingOverlay, { message }));
                return Promise.resolve(loadingElement);
            };

            // Método dismiss()
            const dismiss = (): Promise<boolean> => {
                root.unmount();
                document.body.removeChild(container);
                return Promise.resolve(true);
            };

            // Guardar los métodos en el propio elemento (igual que Angular)
            loadingElement.present = present;
            loadingElement.dismiss = dismiss;

            // Devolver el componente listo
            resolve(loadingElement);
        });
    }
}