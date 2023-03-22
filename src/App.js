// Importer les hooks nécessaires
import { useState, useEffect } from "react";
import "./App.css";

// Tâches par défaut
const defaultTasks = [
  { number: 1, title: "Idée", isChecked: true, dueDate: "2023-04-01" },
  { number: 2, title: "Marché", isChecked: true, dueDate: "2023-04-01" },
  { number: 3, title: "Wireframe", isChecked: true, dueDate: "2023-04-01" },
  { number: 4, title: "Design", isChecked: true, dueDate: "2023-04-01" },
  { number: 5, title: "Landingpage", isChecked: true, dueDate: "2023-04-01" },
  { number: 6, title: "Développement", isChecked: false, dueDate: "2023-04-01" },
  { number: 7, title: "Publish", isChecked: false, dueDate: "2023-04-01" },
  { number: 8, title: "Pub", isChecked: false, dueDate: "2023-04-01" },
  { number: 9, title: "Feedback", isChecked: false, dueDate: "2023-04-01" },
];

// Composant principal de l'application
function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Charger les tâches stockées ou utiliser les tâches par défaut
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    } else {
      setTasks(defaultTasks);
    }
  }, []);

  // Enregistrer les tâches dans localStorage lorsqu'elles sont modifiées
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Ajouter une tâche
  function addTask(number, title, dueDate) {
    const newTask = { number, title, isChecked: false, dueDate };
    setTasks([...tasks, newTask]);
  }

  // Supprimer une tâche
  function deleteTask(index) {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  }

  // Cocher/décocher une tâche
  function checkTask(index) {
    const newTasks = [...tasks];
    newTasks[index].isChecked = !newTasks[index].isChecked;
    setTasks(newTasks);
  }

  // Déplacer une tâche
  function moveTask(fromIndex, toIndex) {
    const newTasks = [...tasks];
    const movedTask = newTasks.splice(fromIndex, 1)[0];
    newTasks.splice(toIndex, 0, movedTask);
    setTasks(newTasks);
  }

  // Gérer la soumission du formulaire d'ajout
  function handleAddFormSubmit(event) {
    event.preventDefault();
    const number = event.target.elements["number"].value;
    const title = event.target.elements["title"].value;
    const dueDate = event.target.elements["dueDate"].value || "";
    if (number && title) {
      addTask(number, title, dueDate);
      setAddModalOpen(false);
      event.target.reset();
    }
  }

  // Gérer la soumission du formulaire de recherche
  function handleSearchFormSubmit(event) {
    event.preventDefault();
    const searchTerm = event.target.elements["search"].value;
    setSearch(searchTerm);
    setSearchModalOpen(false);
  }

  // Filtrer les tâches en fonction du texte de recherche
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||      
      task.number.toString().includes(search) ||
      (task.dueDate && task.dueDate.includes(search))
  );

 // Rendu du composant
 return (
    <div className="App">
      <header className="header">ToDo List</header>
      <div className="task-list">
        {filteredTasks.map((task, index) => (
          <div
            key={index}
            className={`task ${task.isChecked ? "checked" : ""}`}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("text/plain", index);
            }}
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={(event) => {
              const fromIndex = event.dataTransfer.getData("text/plain");
              const toIndex = index;
              moveTask(fromIndex, toIndex);
            }}
          >
            <div className="task-number">{task.number}</div>
            <div className="task-title">
              {task.title}
              {task.dueDate && (
                <span className="task-dueDate"> ({task.dueDate})</span>
              )}
              {task.dueDate && new Date(task.dueDate) < new Date() && (
                <span className="task-overdue"> Late!</span>
              )}
            </div>
            <div className="task-buttons">
              <button
                className={`check-button ${task.isChecked ? "checked" : ""}`}
                onClick={() => checkTask(index)}
              >
                ✓
              </button>
              <button
                className="delete-button"
                onClick={() => deleteTask(index)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
          <div className="add-button" onClick={() => setAddModalOpen(true)}>
        +
      </div>
      <button
        className="search-button"
        onClick={() => setSearchModalOpen(true)}
      >
        🔍
      </button>
    </div>
    <div className={`add-modal ${addModalOpen ? "show" : ""}`}>
      <form className="add-form" onSubmit={handleAddFormSubmit}>
        <label htmlFor="number">Number :</label>
        <input type="number" name="number" />
        <label htmlFor="title">Title :</label>
        <input type="text" name="title" />
        <label htmlFor="dueDate">Due Date :</label>
        <input type="date" name="dueDate" />
        <div className="button-group">
          <button type="submit" className="submit-button">
            Add
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setAddModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    <div className={`search-modal ${searchModalOpen ? "show" : ""}`}>
      <form className="search-form" onSubmit={handleSearchFormSubmit}>
        <label htmlFor="search">Search : </label>
        <input type="text" name="search" />
        <div className="button-group">
          <button type="submit" className="submit-button">
            Ok
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setSearchModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);
}

export default App;