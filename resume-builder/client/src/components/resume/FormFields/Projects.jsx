import { useState, useEffect } from 'react';
import { Plus, Trash2, Rocket } from 'lucide-react';

const Projects = ({ data, onChange }) => {
  const [projects, setProjects] = useState(data.length > 0 ? data : [
    {
      name: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: '',
    }
  ]);

  useEffect(() => {
    onChange(projects);
  }, [projects]);

  const addProject = () => {
    setProjects([...projects, {
      name: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: '',
    }]);
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const addTechnology = (projIndex, tech) => {
    const updated = [...projects];
    if (tech && !updated[projIndex].technologies.includes(tech)) {
      updated[projIndex].technologies.push(tech);
      setProjects(updated);
    }
  };

  const removeTechnology = (projIndex, techIndex) => {
    const updated = [...projects];
    updated[projIndex].technologies = updated[projIndex].technologies.filter((_, i) => i !== techIndex);
    setProjects(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Rocket size={20} />
            Projects
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Showcase your best work
          </p>
        </div>
        <button
          onClick={addProject}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      <div className="space-y-6">
        {projects.map((project, projIndex) => (
          <div key={projIndex} className="border border-gray-200 rounded-lg p-6 relative">
            {projects.length > 1 && (
              <button
                onClick={() => removeProject(projIndex)}
                className="absolute right-2 top-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            )}

            <div className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(projIndex, 'name', e.target.value)}
                  placeholder="E-commerce Platform"
                  className="input"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(projIndex, 'description', e.target.value)}
                  placeholder="Describe what the project does and your role..."
                  rows="3"
                  className="input resize-none"
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies Used
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="React, Node.js, MongoDB..."
                    className="input flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechnology(projIndex, e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tech}
                      <button
                        onClick={() => removeTechnology(projIndex, techIndex)}
                        className="hover:text-blue-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* URL & Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project URL
                  </label>
                  <input
                    type="url"
                    value={project.url}
                    onChange={(e) => updateProject(projIndex, 'url', e.target.value)}
                    placeholder="https://project.com"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={project.startDate}
                    onChange={(e) => updateProject(projIndex, 'startDate', e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={project.endDate}
                    onChange={(e) => updateProject(projIndex, 'endDate', e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;