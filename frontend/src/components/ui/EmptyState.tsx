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
        <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center">
            <p className="text-sm text-muted mb-4">{message}</p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primaryHover"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
