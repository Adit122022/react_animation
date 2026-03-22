const CreativeTemplate = ({ data }) => {
  const formatDate = (date) => {
    if (!date) return 'Present';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-[210mm] min-h-[297mm] bg-gradient-to-br from-purple-50 to-pink-50 flex">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-purple-600 to-pink-600 text-white p-8">
        <div className="mb-8">
          <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-6xl text-purple-600 font-bold">
              {data?.personalInfo?.fullName?.charAt(0) || 'Y'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">
            {data?.personalInfo?.fullName || 'Your Name'}
          </h1>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 border-b-2 border-white/30 pb-2">
            CONTACT
          </h2>
          <div className="space-y-2 text-sm">
            {data?.personalInfo?.email && (
              <p className="break-words">✉️ {data.personalInfo.email}</p>
            )}
            {data?.personalInfo?.phone && (
              <p>📱 {data.personalInfo.phone}</p>
            )}
            {data?.personalInfo?.location && (
              <p>📍 {data.personalInfo.location}</p>
            )}
            {data?.personalInfo?.linkedin && (
              <p className="break-words">🔗 LinkedIn</p>
            )}
            {data?.personalInfo?.github && (
              <p className="break-words">💻 GitHub</p>
            )}
          </div>
        </div>

        {/* Skills */}
        {data?.skills && (data.skills.technical?.length > 0 || data.skills.soft?.length > 0) && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3 border-b-2 border-white/30 pb-2">
              SKILLS
            </h2>
            
            {data.skills.technical && data.skills.technical.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-sm">TECHNICAL</h3>
                <div className="space-y-1">
                  {data.skills.technical.map((skill, index) => (
                    <div key={index} className="text-sm">
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {data.skills.soft && data.skills.soft.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-sm">SOFT SKILLS</h3>
                <div className="space-y-1">
                  {data.skills.soft.map((skill, index) => (
                    <div key={index} className="text-sm">
                      • {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Languages */}
        {data?.skills?.languages && data.skills.languages.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3 border-b-2 border-white/30 pb-2">
              LANGUAGES
            </h2>
            <div className="space-y-1 text-sm">
              {data.skills.languages.map((lang, index) => (
                <p key={index}>• {lang}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-8 bg-white">
        {/* Summary */}
        {data?.personalInfo?.summary && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-3">
              ABOUT ME
            </h2>
            <p className="text-gray-700 text-justify leading-relaxed">
              {data.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data?.experience && data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              EXPERIENCE
            </h2>
            
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-4 relative pl-6 border-l-2 border-purple-300">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-purple-600 rounded-full"></div>
                
                <div className="mb-1">
                  <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                  <p className="text-purple-700 font-semibold">
                    {exp.company}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
                
                {exp.description && (
                  <p className="text-gray-700 mb-2 text-sm">
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
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              EDUCATION
            </h2>
            
            {data.education.map((edu, index) => (
              <div key={index} className="mb-3 pl-6 border-l-2 border-purple-300 relative">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-purple-600 rounded-full"></div>
                
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-purple-700 font-semibold">{edu.institution}</p>
                <p className="text-sm text-gray-600">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data?.projects && data.projects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              PROJECTS
            </h2>
            
            {data.projects.map((project, index) => (
              <div key={index} className="mb-4 pl-6 border-l-2 border-purple-300 relative">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-purple-600 rounded-full"></div>
                
                <h3 className="font-bold text-gray-900">{project.name}</h3>
                
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-purple-700 mb-1">
                    {project.technologies.join(' • ')}
                  </p>
                )}
                
                {project.description && (
                  <p className="text-sm text-gray-700">
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeTemplate;