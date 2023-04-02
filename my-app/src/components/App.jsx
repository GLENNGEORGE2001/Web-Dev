import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import React, { useState } from "react";
import CreateArea from "./CreateArea";


function App() {

  const [allNotes, setNotes] = useState([]);

  // Add new Notes
  function addNote(check){
    setNotes((prevValue)=>{
      return [
        ...prevValue,
        {
          key: allNotes.length===0 ? 1 : allNotes[allNotes.length-1].key+1,
          title: check.title,
          content: check.content
        }
      ];
    });
  }

  // Delete Notes
  function deleteItem(id){
    setNotes((prevValue)=>{
      return prevValue.filter((item)=>{
        return item.key !== id;
      });
    });
  }

  // Rendered Component
    return (
      <div>
        <Header />
        <CreateArea func={addNote}/>
        {allNotes.map((x)=><Note key={x.key} id={x.key} title={x.title} content={x.content} deleteFunction={deleteItem}/>)}
        <Footer />
      </div>
    );
}

export default App;
