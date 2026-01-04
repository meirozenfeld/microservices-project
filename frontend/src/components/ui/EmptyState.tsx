type Props = {
    message: string;
    actionLabel?: string;
    onAction?: () => void;
};

export default function EmptyState({ message, actionLabel, onAction }: Props) {
    return (
        <div>
            <p>{message}</p>
            {actionLabel && onAction && (
                <button onClick={onAction}>{actionLabel}</button>
            )}
        </div>
    );
}
