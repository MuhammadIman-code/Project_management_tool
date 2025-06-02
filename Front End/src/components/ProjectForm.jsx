import {  useState } from "react";


function ProjectForm({ onClose, onCreate }) {
  const [card, setCard] = useState({
    name:"",
    description:"",
  });
  

let handle_change = (e)=> {
    const {name,value} = e.target
  setCard({
      ...card,
      [name]: value,
    });
}


  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Backend API call example (commented)
    // axios.post('/api/projects', newProject)
    //   .then(res => {
    //     onCreate(res.data);
    //   })
    //   .catch(err => {
    //     setFormError('Failed to create project');
    //   });

    // Add new project locally for frontend testing
   onCreate(card);
  setCard({
  name: "",
  description: "",
});

  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Project</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        {/* {formError && (
          <p className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
            {formError}
          </p>
        )} */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="project-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Project Name *
            </label>
            <input
              name="name"
              id="project-name"
              type="text"
              value={card.name}
              onChange = {handle_change}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="project-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description *
            </label>
            <textarea
              name="description"
              id="project-description"
              value={card.description}
              onChange = {handle_change}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            ></textarea>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
              disabled={!card.name || !card.description}
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm