type Props = {
    message?: string;
};

export default function LoadingState({
    message = "Loading…",
}: Props) {
    return (
        <div
            role="status"
            aria-live="polite"
            className="text-sm text-muted"
        >
            {message}
        </div>
    );
}
