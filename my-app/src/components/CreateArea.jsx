import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';

function CreateArea(props) {
  const [userInput, setInput] = useState({
    title: "",
    content: ""
  });

  const [isClicked, setClick] = useState(false);

  function handleClick(){
    setClick(true);
  }

  // Saving the state of the user input
  function handleChange(event){
    const {name, value} = event.target;
    setInput((prevValue)=>{
      return {
        ...prevValue,
        [name]: value
      };
    });
  }

  // Rendered Component
  return (
    <div>
      <form className="create-note">
        {isClicked && <input onChange={handleChange} name="title" placeholder="Title" value={userInput.title} />}
        <textarea onClick={handleClick} onChange={handleChange} name="content" placeholder="Take a note..." rows={isClicked ? 3 : 1} value={userInput.content} />
        <Zoom in={isClicked}>
        <Fab onClick={(event)=>{
          props.func(userInput);
          event.preventDefault()
        }}><AddIcon /></Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;