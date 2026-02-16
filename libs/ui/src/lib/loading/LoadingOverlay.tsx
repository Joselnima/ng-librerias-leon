import React from 'react';
import './LoadingOverlay.scss';

// Interfaces
import { LoadingProps } from './interface/loading-props.interface';

const LoadingOverlay: React.FC<LoadingProps> = ({ message = 'Cargando...' }) => {
    return (
        <div className="loading-host">
            <div className="loading-wrapper">
                <div className="loading-spinner"></div>
                <div className="loading-content">{message}</div>
            </div>
        </div>
    );
};

export default LoadingOverlay;