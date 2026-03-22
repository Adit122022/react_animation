const ClassicTemplate = ({ data }) => {
  const formatDate = (date) => {
    if (!date) return 'Present';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white p-12 font-serif text-gray-900">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-5xl font-bold mb-3">
          {data?.personalInfo?.fullName || 'Your Name'}
        </h1>
        
        <div className="text-sm text-gray-700 space-x-3">
          {data?.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data?.personalInfo?.phone && <span>•</span>}
          {data?.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          {data?.personalInfo?.location && <span>•</span>}
          {data?.personalInfo?.location && <span>{data.personalInfo.location}</span>}
        </div>

        {(data?.personalInfo?.linkedin || data?.personalInfo?.github) && (
          <div className="text-sm text-gray-600 mt-2 space-x-3">
            {data?.personalInfo?.linkedin && (
              <a href={data.personalInfo.linkedin} className="hover:underline">
                LinkedIn
              </a>
            )}
            {data?.personalInfo?.github && <span>•</span>}
            {data?.personalInfo?.github && (
              <a href={data.personalInfo.github} className="hover:underline">
                GitHub
              </a>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {data?.personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 uppercase border-b border-gray-400 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-800 text-justify leading-relaxed">
            {data.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data?.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase border-b border-gray-400 pb-1">
            Professional Experience
          </h2>
          
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between mb-1">
                <div>
                  <h3 className="font-bold text-lg">{exp.title}</h3>
                  <p className="italic text-gray-700">
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </p>
                </div>
                <span className="text-gray-700 text-sm">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              
              {exp.description && (
                <p className="text-gray-800 mb-2 text-justify">
                  {exp.description}
                </p>
              )}
              
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="list-disc list-inside text-gray-800 space-y-1">
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
          <h2 className="text-xl font-bold mb-3 uppercase border-b border-gray-400 pb-1">
            Education
          </h2>
          
          {data.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="italic text-gray-700">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </p>
                </div>
                <span className="text-gray-700 text-sm">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              
              {edu.gpa && (
                <p className="text-gray-800">GPA: {edu.gpa}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data?.skills && (data.skills.technical?.length > 0 || data.skills.soft?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase border-b border-gray-400 pb-1">
            Skills
          </h2>
          
          {data.skills.technical && data.skills.technical.length > 0 && (
            <p className="mb-2">
              <strong>Technical Skills:</strong> {data.skills.technical.join(', ')}
            </p>
          )}
          
          {data.skills.soft && data.skills.soft.length > 0 && (
            <p className="mb-2">
              <strong>Soft Skills:</strong> {data.skills.soft.join(', ')}
            </p>
          )}

          {data.skills.languages && data.skills.languages.length > 0 && (
            <p>
              <strong>Languages:</strong> {data.skills.languages.join(', ')}
            </p>
          )}
        </div>
      )}

      {/* Projects */}
      {data?.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase border-b border-gray-400 pb-1">
            Projects
          </h2>
          
          {data.projects.map((project, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold">
                {project.name}
                {project.url && (
                  <span className="text-sm font-normal ml-2">
                    ({project.url})
                  </span>
                )}
              </h3>
              
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-sm italic text-gray-700">
                  {project.technologies.join(', ')}
                </p>
              )}
              
              {project.description && (
                <p className="text-gray-800 text-justify">
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

export default ClassicTemplate;