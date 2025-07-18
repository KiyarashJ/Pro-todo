import { Suspense, useEffect, useReducer, useTransition } from 'react';
import './App.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Delete from './delete/deleteIcon';
import EditIcon from './edit/editIcon';

type Todo = {
  title: string;
  desc: string;
  isClicked: boolean;
};

type State = {
  isClicked: boolean;
  title: string;
  desc: string;
  todos: Todo[];
  editingTodo: string | null;
  editTitle: string;
  editDesc: string;
  editIsClicked: boolean;
}


type Action =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_DESC'; payload: string }
  | { type: 'SET_IS_CLICKED'; payload: boolean }
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'START_EDIT'; payload: Todo }
  | { type: 'SET_EDIT_TITLE'; payload: string }
  | { type: 'SET_EDIT_DESC'; payload: string }
  | { type: 'SET_EDIT_IS_CLICKED'; payload: boolean }
  | { type: 'CANCEL_EDIT' };

const initialState: State = {
  isClicked: false,
  title: '',
  desc: '',
  todos: [],
  editingTodo: null,
  editTitle: '',
  editDesc: '',
  editIsClicked: false,
};


function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_DESC':
      return { ...state, desc: action.payload };
    case 'SET_IS_CLICKED':
      return { ...state, isClicked: action.payload };
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'START_EDIT':
      return {
        ...state,
        editingTodo: action.payload.title,
        editTitle: action.payload.title,
        editDesc: action.payload.desc,
        editIsClicked: action.payload.isClicked,
      };
    case 'SET_EDIT_TITLE':
      return { ...state, editTitle: action.payload };
    case 'SET_EDIT_DESC':
      return { ...state, editDesc: action.payload };
    case 'SET_EDIT_IS_CLICKED':
      return { ...state, editIsClicked: action.payload };
    case 'CANCEL_EDIT':
      return { ...state, editingTodo: null, editTitle: '', editDesc: '', editIsClicked: false };
    default:
      return state;
  }
}




function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    
    async function getTodos() {
      try {
        const response = await axios.get('http://localhost:3000/all-todos');
        dispatch({ type: 'SET_TODOS', payload: response.data === 'no todos !' ? [] : response.data });
      } catch (error) {
        console.error('Error fetching todos:', error);
        toast.error('Failed to fetch todos');
      }
    }
    getTodos();
  }, []);

  const submitHandler = async () => {
    if (!state.title || !state.desc) {
      toast.error('Complete all fields');
      return;
    }
    try {
      const data = { title: state.title, desc: state.desc, isClicked: state.isClicked };
      console.log('Data sent to backend:', data);
      startTransition(async () => {
        const response = await axios.post('http://localhost:3000/write-todo', data);
        toast.success(response.data.msg);
        dispatch({ type: 'SET_TITLE', payload: '' });
        dispatch({ type: 'SET_DESC', payload: '' });
        dispatch({ type: 'SET_IS_CLICKED', payload: false });
        
        const updatedTodos = await axios.get('http://localhost:3000/all-todos');
        dispatch({ type: 'SET_TODOS', payload: updatedTodos.data });
      })
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Failed to add todo');
    }
  };

  const handleEditClick = (todo: Todo) => {
    dispatch({ type: 'START_EDIT', payload: todo });
  };

  const handleSaveEdit = async (originalTitle: string) => {
    try {
      const updatedData = {
        title: state.editTitle,
        desc: state.editDesc,
        isClicked: state.editIsClicked,
      };
      startTransition(async () => {
        const response = await axios.put(`http://localhost:3000/edit-todo?Title=${encodeURIComponent(originalTitle)}`, updatedData);
        toast.success(response.data.msg);
        dispatch({ type: 'CANCEL_EDIT' }); 
        
        const updatedTodos = await axios.get('http://localhost:3000/all-todos');
        dispatch({ type: 'SET_TODOS', payload: updatedTodos.data });
      })
    } catch (error) {
      console.error('Error editing todo:', error);
      toast.error('Failed to edit todo');
    }
  };

  return (
    <>
    <Suspense fallback={<div className='fallback'></div>}></Suspense>
      <div className="allBox">
        <div className="ConBox">
          <aside className="preview">
            {state.todos.length > 0 ? (
              state.todos.map((todo) => (
                <div key={todo.title} className="todoBoxCon">
                  {state.editingTodo === todo.title ? (
                    <>
                      <h3 className="titles">Todo:</h3>
                      <input
                        type="text"
                        className="title"
                        value={state.editTitle}
                        onChange={(e) => dispatch({ type: 'SET_EDIT_TITLE', payload: e.target.value })}
                      />
                      <h3 className="titles">Description:</h3>
                      <textarea
                        className="description"
                        value={state.editDesc}
                        onChange={(e) => dispatch({ type: 'SET_EDIT_DESC', payload: e.target.value })}
                        placeholder="Write your description about Todo..."
                      />
                      <h3 className="titles">IsDone:</h3>
                      <div
                        className={state.editIsClicked ? 'isDoneBtnClicked' : 'isDoneBtn'}
                        onClick={() => dispatch({ type: 'SET_EDIT_IS_CLICKED', payload: !state.editIsClicked })}
                      ></div>
                      <button
                        className="subBtn"
                        onClick={() => handleSaveEdit(todo.title)}
                        disabled={isPending}
                      >
                        {isPending ? "saving..." : "save"}
                      </button>
                      <button
                        className="subBtn"
                        onClick={() =>  dispatch({ type: 'CANCEL_EDIT' })}
                        disabled={isPending}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="titles">Todo:</h3>
                      <div className="title-text">{todo.title}</div>
                      <br />
                      <br />
                      <h3 className="titles">Description:</h3>
                      <div className="desc-text">{todo.desc}</div>
                      <br />
                      <br />
                      <h3 className="titles">IsDone:</h3>
                      <span className={todo.isClicked ? 'clicked' : 'unclicked'}>
                        {todo.isClicked ? 'Done' : 'unDone'}
                      </span>
                      <br />
                      <br />
                      <hr className="hr" />
                      <div className="icons">
                        <Delete sendTitle={todo.title} />
                        <EditIcon onEdit={() => handleEditClick(todo)} />
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <h2 className="no-todos">No todos!</h2>
            )}
          </aside>
          <div className="TodoCon">
            <h1>Todo:</h1>
            <input
              type="text"
              className="title"
              value={state.title}
              onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })}
              disabled={isPending}
            />
            <h1>Description:</h1>
            <textarea
              className="description"
              placeholder="Write your description about Todo..."
              value={state.desc}
              onChange={(e) =>  dispatch({ type: 'SET_DESC', payload: e.target.value })}
              disabled={isPending}
            />
            <h1>isDone:</h1>
            <div
              className={state.isClicked ? 'isDoneBtnClicked' : 'isDoneBtn'}
              onClick={() => dispatch({ type: 'SET_IS_CLICKED', payload: !state.isClicked })}
            ></div>
            <input
              type="submit"
              value="Submit"
              className="subBtn"
              onClick={submitHandler}
              disabled={isPending}
            />
          </div>
        </div>
      </div>
      <ToastContainer theme="dark" position="bottom-center" />
    </>
  );
}

export default App;