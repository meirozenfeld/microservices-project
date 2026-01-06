type Props = {
    message: string;
    actionLabel?: string;
    onAction?: () => void;
};

export default function EmptyState({
    message,
    actionLabel,
    onAction,
}: Props) {
    return (
        <div style={{ padding: 16 }}>
            <p style={{ marginBottom: actionLabel ? 12 : 0 }}>
                {message}
            </p>

            {actionLabel && onAction && (
                <button onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
