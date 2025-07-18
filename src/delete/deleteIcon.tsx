import axios from "axios";
import "./deleteIcon.css"
import { useTransition } from "react";


export default function Delete(todotitle: {sendTitle: String}) {
    let data: String = todotitle.sendTitle;
    const [isPending, startTransition] = useTransition();
    const deleteHandler = async () => {
        startTransition(async () => {
            const deleteTodo: void = await axios.delete(`http://localhost:3000/delete-todo?title=${data}`)
                .then(res => console.log(res.data.msg))
                .catch(err => err)
            })
        }


    return (
        <>
            <img
             src="/public/filled-trash.png" 
             alt="trashIcon" 
             className="trashIcon" 
             onClick={() => deleteHandler()}
             style={isPending ? {opacity: 0.4} : {opacity: 1}}
            />
        </>
    )
}