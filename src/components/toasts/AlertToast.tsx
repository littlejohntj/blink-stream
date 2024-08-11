import { AlertState, AlertType } from '../../utils/shared/types/alert-state'; // Assuming these types are defined in a types file

interface AlertToastProps {
    alertState: AlertState;
}

const SuccessIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ErrorIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const InfoIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
);

export default function AlertToast({ alertState }: AlertToastProps) {
    const alertClass = `alert ${alertState.type === AlertType.SUCCESS ? 'alert-success' : alertState.type === AlertType.ERROR ? 'alert-error' : 'alert-info'}`;
    const Icon = alertState.type === AlertType.SUCCESS ? SuccessIcon : alertState.type === AlertType.ERROR ? ErrorIcon : InfoIcon;

    return (
        <div className="toast toast-top toast-center">
            <div role="alert" className={alertClass}>
                <Icon />
                <span>{alertState.message}</span>
            </div>
        </div>
    );
}