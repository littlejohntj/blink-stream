export enum AlertType {
    INFO = 'info',
    SUCCESS = 'success',
    ERROR = 'error'
}

export interface AlertState {
    message: string
    type: AlertType
}