import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import LoadingIndicator from "../components/LoadingIndicator";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getNotes();
  }, []);
  const getNotes = () => {
    setLoading(true);
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        (setNotes(data), console.log(data));
      })
      .catch((error) => alert(error))
      .finally(() => setLoading(false));
  };
  const deleteNote = (id) => {
    setLoading(true);
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Note deleted successfully");
        } else {
          alert("Failed to delete note");
        }
        getNotes();
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //   return <div>Home</div>;
  const createNote = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(`Title: ${title}\nContent: ${content}`);
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) {
          alert("Note created successfully");
        } else {
          alert("Failed to create note");
        }
        getNotes();
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div>
      {loading && <LoadingIndicator />}
      <div>
        <h2>Notes</h2>
        {notes.map((note) => (
          <Note note={note} onDelete={deleteNote} key={note.id} />
        ))}
      </div>
      <div>
        <h2>Create a Note</h2>
        <form onSubmit={createNote}>
          <label htmlFor="title">Title</label>
          <br />
          <input
            type="text"
            id="title"
            name="title"
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <label htmlFor="content">Content</label>
          <br />
          <textarea
            id="content"
            name="content"
            required
            onChange={(e) => setContent(e.target.value)}
          />
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default Home;
