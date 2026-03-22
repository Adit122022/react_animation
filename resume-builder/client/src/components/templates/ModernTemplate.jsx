const ModernTemplate = ({ data }) => {
  const formatDate = (date) => {
    if (!date) return 'Present';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white p-12 font-sans text-gray-800">
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {data?.personalInfo?.fullName || 'Your Name'}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {data?.personalInfo?.email && (
            <span>✉️ {data.personalInfo.email}</span>
          )}
          {data?.personalInfo?.phone && (
            <span>📱 {data.personalInfo.phone}</span>
          )}
          {data?.personalInfo?.location && (
            <span>📍 {data.personalInfo.location}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-blue-600 mt-2">
          {data?.personalInfo?.linkedin && (
            <a href={data.personalInfo.linkedin} className="hover:underline">
              LinkedIn
            </a>
          )}
          {data?.personalInfo?.github && (
            <a href={data.personalInfo.github} className="hover:underline">
              GitHub
            </a>
          )}
          {data?.personalInfo?.portfolio && (
            <a href={data.personalInfo.portfolio} className="hover:underline">
              Portfolio
            </a>
          )}
        </div>

        {data?.personalInfo?.summary && (
          <p className="mt-4 text-gray-700 leading-relaxed text-justify">
            {data.personalInfo.summary}
          </p>
        )}
      </div>

      {/* Experience */}
      {data?.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 uppercase tracking-wide">
            Experience
          </h2>
          
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {exp.title}
                  </h3>
                  <p className="text-gray-700 font-medium">
                    {exp.company}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              
              {exp.description && (
                <p className="text-gray-700 mb-2 text-sm leading-relaxed">
                  {exp.description}
                </p>
              )}
              
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {exp.achievements.filter(a => a.trim()).map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data?.education && data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 uppercase tracking-wide">
            Education
          </h2>
          
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {edu.degree}
                  </h3>
                  <p className="text-gray-700">
                    {edu.institution}
                    {edu.location && ` • ${edu.location}`}
                  </p>
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              
              {edu.gpa && (
                <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>
              )}
              
              {edu.achievements && edu.achievements.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-2">
                  {edu.achievements.filter(a => a.trim()).map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data?.skills && (data.skills.technical?.length > 0 || data.skills.soft?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 uppercase tracking-wide">
            Skills
          </h2>
          
          {data.skills.technical && data.skills.technical.length > 0 && (
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 mb-2">Technical:</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.technical.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {data.skills.soft && data.skills.soft.length > 0 && (
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 mb-2">Soft Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.soft.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.skills.languages && data.skills.languages.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Languages:</h3>
              <p className="text-gray-700 text-sm">
                {data.skills.languages.join(' • ')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Projects */}
      {data?.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 uppercase tracking-wide">
            Projects
          </h2>
          
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {project.name}
                  {project.url && (
                    <a
                      href={project.url}
                      className="text-blue-600 text-sm ml-2 hover:underline"
                    >
                      🔗
                    </a>
                  )}
                </h3>
                {project.startDate && (
                  <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                  </span>
                )}
              </div>
              
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Tech:</strong> {project.technologies.join(', ')}
                </p>
              )}
              
              {project.description && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;