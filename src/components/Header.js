
import React from 'react'
import { Container,Row, Col , Card, Button} from 'react-bootstrap';
import { useState, useEffect} from 'react';
import { AiOutlineDelete ,AiOutlineEdit} from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";

const Header = () => {
    const [isCompleteScreen, setIsCompleteScreen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [completedTodos, setCompletedTodos] = useState([]);
    const [allTodos, setTodos] = useState([]);
    const [currentEdit, setCurrentEdit] = useState("");
    const [currentEditedItem, setCurrentEditedItem] = useState({});
    
    
    const handleAddTodo = () => {
        let newTodoItem = {
            title: newTitle,
            description: newDescription,
        };
        let updatedTodoArr = [...allTodos];
        updatedTodoArr.push (newTodoItem);
        setTodos (updatedTodoArr);
        localStorage.setItem ('todolist', JSON.stringify (updatedTodoArr));
        setNewTitle ('');
        setNewDescription ('');
    };

    const handleDeleteTodo = index => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice (index,1);

    localStorage.setItem ('todolist', JSON.stringify (reducedTodo));
    setTodos (reducedTodo);
  };

    const handleComplete = index => {
    let now = new Date ();
    let dd = now.getDate ();
    let mm = now.getMonth () + 1;
    let yyyy = now.getFullYear ();
    let h = now.getHours ();
    let m = now.getMinutes ();
    let s = now.getSeconds ();
    let completedOn =
      dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push (filteredItem);
    setCompletedTodos (updatedCompletedArr);
    handleDeleteTodo (index);
    localStorage.setItem (
      'completedTodos',
      JSON.stringify (updatedCompletedArr)
    );
  };

    const handleDeleteCompletedTodo = index => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice (index,1);

    localStorage.setItem ('completedTodos', JSON.stringify (reducedTodo));
    setCompletedTodos (reducedTodo);
  };

    useEffect (() => {
    let savedTodo = JSON.parse (localStorage.getItem ('todolist'));
    let savedCompletedTodo = JSON.parse (
      localStorage.getItem ('completedTodos')
    );
    if (savedTodo) {
      setTodos (savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos (savedCompletedTodo);
    }
  }, []);


   const handleEdit = (ind,item)=>{
    console.log(ind);
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  }

  const handleUpdateTitle = (value)=>{
    setCurrentEditedItem((prev)=>{
      return {...prev,title:value}
    })
  }

  const handleUpdateDescription = (value)=>{
    setCurrentEditedItem((prev)=>{
      return {...prev,description:value}
    })
  }

  const handleUpdateToDo = ()=>{
      let newToDo = [...allTodos];
      newToDo[currentEdit] = currentEditedItem;
      setTodos(newToDo);
      localStorage.setItem('todolist',JSON.stringify(newToDo));
      setCurrentEdit("");
  }

  return (
    <>
        <Container>           
            <Row>
                <Col md={2} className="col-lft"></Col>
                <Col md={8}>
                    <div className="header">
                        <h1>My Todo</h1>
                        <Card className="w-100">
                            <Card.Body>
                                <div className="add-todo">         
                                        <input type="text" placeholder="Enter task"
                                        value={newTitle}
                                        onChange={e => setNewTitle (e.target.value)}
                                        />
                                        <input type="text" placeholder=" Task's description"
                                        value={newDescription}
                                        onChange={e => setNewDescription (e.target.value)}
                                        />
                                        <button type="button"
                                            onClick={handleAddTodo}
                                            className="primaryBtn"
                                            >
                                            Add Todo
                                        </button>
                                        <hr></hr>
                                </div>
                                <div className="sub-btn d-flex">
                                    <Button className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
                                    onClick={() => setIsCompleteScreen (false)}>To Do</Button>
                                    <Button className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
                                    onClick={() => setIsCompleteScreen (true)}>Completed</Button>                 
                                </div>

                                
                                <div className="todo-list">

                                    {isCompleteScreen === false &&
                                        allTodos.map ((item, index) => {
                                        if(currentEdit===index){
                                            return(
                                            <div className='edit__wrapper' key={index}>
                                            <input placeholder='Updated Title' 
                                            onChange={(e)=>handleUpdateTitle(e.target.value)} 
                                            value={currentEditedItem.title}  />
                                            <textarea placeholder='Updated Title' 
                                            rows={4}
                                            onChange={(e)=>handleUpdateDescription(e.target.value)} 
                                            value={currentEditedItem.description}  />
                                            <button
                                        type="button"
                                        onClick={handleUpdateToDo}
                                        className="primaryBtn"
                                        >
                                        Update
                                        </button>
                                        </div> 
                                            ) 
                                        }else{
                                            return (
                                            <div className="todo-list-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center " key={index}>
                                                <div>
                                                <h5>{item.title}</h5>
                                                <p>{item.description}</p>
                                                </div>
                            
                                                <div className="sub-icons "> 
                                                <AiOutlineDelete
                                                    className="icon"
                                                    onClick={() => handleDeleteTodo (index)}
                                                    title="Delete?"
                                                />
                                                <BsCheckLg
                                                    className="check-icon"
                                                    onClick={() => handleComplete (index)}
                                                    title="Complete?"
                                                />
                                                <AiOutlineEdit  className="check-icon"
                                                    onClick={() => handleEdit (index,item)}
                                                    title="Edit?" />
                                                </div>
                            
                                            </div>
                                            );
                                        }
                                        
                                        })}

                                    {isCompleteScreen === true &&
                                        completedTodos.map ((item, index) => {
                                        return (
                                            <div className="todo-list-item d-flex" key={index}>
                                            <div>
                                                <h3>{item.title}</h3>
                                                <p>{item.description}</p>
                                                <p><small>Completed on: {item.completedOn}</small></p>
                                            </div>

                                            <div>
                                                <AiOutlineDelete
                                                className="icon"
                                                onClick={() => handleDeleteCompletedTodo (index)}
                                                title="Delete?"
                                                />
                                            </div>

                                            </div>
                                        );
                                        })}
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
                <Col md={2}></Col>
            </Row>
        </Container>
    </>
  )
}

export default Header