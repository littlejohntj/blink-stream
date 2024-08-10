import { AlertState, AlertType } from '../../utils/types/alert-state'; // Assuming these types are defined in a types file

interface AlertToastProps {
    alertState: AlertState;
}

export default function AlertToast({ alertState }: AlertToastProps) {
    const alertClass = `alert ${alertState.type === AlertType.SUCCESS ? 'alert-success' : alertState.type === AlertType.ERROR ? 'alert-error' : 'alert-info'}`;

    return (
        <div className="toast toast-top toast-center">
            <div role="alert" className={alertClass}>
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
                <span>{alertState.message}</span>
            </div>
        </div>
    );
}