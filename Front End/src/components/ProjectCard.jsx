import { useNavigate } from "react-router-dom";

function ProjectCard({ project }) {
    const navigate = useNavigate();
    
    const handleCardClick = () => {
        navigate(`/projectDetail/${project.id}`, { 
            state: { project },
            replace: false // Ensure this is false to maintain history
        });
    };

    return (
        <div 
            onClick={handleCardClick} 
            className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition-shadow cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
        >
            <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-3">{project.description}</p>
            <span className={`px-2 py-1 text-xs rounded-full ${
                project.verified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
            }`}>
                {project.verified ? 'Verified' : 'Pending'}
            </span>
        </div>
    );
}

export default ProjectCard;