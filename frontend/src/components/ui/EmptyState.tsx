type Props = {
    message: string;
};

export default function EmptyState({ message }: Props) {
    return (
        <div>
            <p>{message}</p>
        </div>
    );
}
