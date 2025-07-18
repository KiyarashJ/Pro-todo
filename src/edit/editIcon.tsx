import "./editIcon.css"


type Edit = {
    onEdit : () => void
}


export default function EditIcon({onEdit}: Edit) {
    return (
        <>
            <img src="/public/tool.png" alt="editIcon" className="editIcon" onClick={onEdit} />
        </>
    )
}