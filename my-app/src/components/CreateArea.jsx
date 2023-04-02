import React, { useState } from "react";

function CreateArea(props) {
  const [userInput, setInput] = useState({
    title: "",
    content: ""
  });

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
      <form>
        <input onChange={handleChange} name="title" placeholder="Title" value={userInput.title} />
        <textarea onChange={handleChange} name="content" placeholder="Take a note..." rows="3" value={userInput.content} />
        <button onClick={(event)=>{
          props.func(userInput);
          event.preventDefault()
        }}>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;