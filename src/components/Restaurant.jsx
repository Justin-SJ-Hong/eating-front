export default function Restaurant() {
    return (
        <div className="m-3! h-36 w-36 bg-gray-500">
            <img
                src="#"
                alt=""
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                }}
            />

        </div>
    )
}