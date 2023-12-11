import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import '../todo/Todo.scss'
export default function Todo() {
  const [newTodo, setNewTodo] = useState({ name: "" });
  const [allToDo, setAllTodo] = useState([]);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [numberTodos, setNumberTodos] = useState(0);
  const [flag, setFlag] = useState(false);

  // get data form server to render
  const handleGetData = async () => {
    setLoading(true);
    const taskPerPage = 4;
    try {
      const res = await axios.get(
        `http://localhost:7000/api/v1/todos?per_page=${taskPerPage}`
      );
      setNumberTodos(res.data.data);
      setAllTodo(res.data.mama);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };
  useEffect(() => {
    handleGetData();
  }, [flag]);

  // Add newtodo
  const handleAddToDo = async () => {
    try {
      const res = await axios.post("http://localhost:7000/api/v1/todos", {
        ...newTodo,
        id: Math.floor(Math.random() * 9999999999),
        completed: false,
      });
      setFlag(!flag);
      setNewTodo({ name: "" });
    } catch (error) {
      console.log(error);
    }
  };

  // change completed to line-through
  const handleChangeCompleted = async (item) => {
    try {
      const res = await axios.patch(
        `http://localhost:7000/api/v1/todos/${item.id}`,
        item
      );
      setFlag(!flag);
    } catch (error) {
      console.log(error);
    }
  };
  //update todos with put
  const handleEdit = async (item) => {
    setEdit(true);
    setNewTodo(item);
  };
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:7000/api/v1/todos/${newTodo.id}`,
        newTodo
      );
      setFlag(!flag);
      setNewTodo({ name: "" });
      setEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  //Del with delete method
  const handleDel = async (id) => {
    try {
      const accept = window.confirm("Are you sure ?");
      if (accept) {
        const res = await axios.delete(
          `http://localhost:7000/api/v1/todos/${id}`
        );
        setFlag(!flag);
        setNewTodo({ ...newTodo, name: "" });
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  //del clear all
  const handleClearAll = async () => {
    try {
      const accept = window.confirm("Are you sure ?");
      if (accept) {
        const res = await axios.delete("http://localhost:7000/api/v1/todos");
        setFlag(!flag);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="bg-gradient-to-r from-cyan-300 to-blue-500 h-[100vh] pt-4 pb-[70px]">
        <div className="bg-gradient-to-r from-emerald-500 via-purple-600 to-pink-500  pb-6 h-[500px] w-[500px] m-auto mt-4 pt-5  leading-10">
          <h1 className="text-3xl text-center ">Todo App</h1>
          <br />
          <input
            type="text"
            ref={inputRef}
            placeholder="Add task"
            value={newTodo.name}
            name="name"
            onChange={(e) =>
              setNewTodo({ ...newTodo, [e.target.name]: e.target.value })
            }
            className="w-[370px] pl-4 ml-5 rounded-[3px]"
          />
          <button
            className="bg-green-400 w-[50px] ml-4 rounded-[4px]"
            onClick={edit ? handleSave : handleAddToDo}
          >
            {edit ? <span>Save</span> : <span>Add</span>}
          </button>
          {loading ? (
           <div className="loader text-center mt-7">
           <p className="text text-white">
           <span className="letter letter1">L</span>
           <span className="letter letter2">o</span>
           <span className="letter letter3">a</span>
           <span className="letter letter4">d</span>
           <span className="letter letter5">i</span>
           <span className="letter letter6">n</span>
           <span className="letter letter7">g</span>
           <span className="letter letter8">.</span>
           <span className="letter letter9">.</span>
           <span className="letter letter10">.</span>
           </p>
         </div>
          ) : (
            <>
              {allToDo.map((item, index) => {
                return (
                  <div key={index} className="pt-5 leading-10 flex">
                    <div
                      className="bg-white w-[370px] ml-5 h-[40px] rounded-[3px] pl-5 cursor-pointer"
                      onClick={() => handleChangeCompleted(item)}
                    >
                      {" "}
                      <p className={item.completed ? "line-through" : ""}>
                        {" "}
                        {item.name}
                      </p>
                    </div>
                    <div className=" ml-4 flex justify-between ">
                      <button
                        className="bg-sky-200 w-[40px] rounded-[3px]"
                        onClick={() => handleDel(item.id)}
                      >
                        Del
                      </button>
                      <button
                        className="bg-green-400 w-[40px] ml-2 rounded-[3px]"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          <div className=" pt-7 leading-10 flex">
            <div className="bg-white w-[370px] ml-5 h-[40px] rounded-[3px] pl-5">
              You have <span className="text-red-400">{numberTodos}</span>{" "}
              pending task !
            </div>
            <button
              className="bg-sky-200 w-[60px] rounded-[3px] ml-4 "
              onClick={handleClearAll}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
