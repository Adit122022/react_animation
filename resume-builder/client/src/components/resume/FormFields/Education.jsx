import { useState, useEffect } from 'react';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

const Education = ({ data, onChange }) => {
  const [educations, setEducations] = useState(data.length > 0 ? data : [
    {
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: [''],
    }
  ]);

  useEffect(() => {
    onChange(educations);
  }, [educations]);

  const addEducation = () => {
    setEducations([...educations, {
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: [''],
    }]);
  };

  const removeEducation = (index) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  const addAchievement = (eduIndex) => {
    const updated = [...educations];
    updated[eduIndex].achievements.push('');
    setEducations(updated);
  };

  const updateAchievement = (eduIndex, achIndex, value) => {
    const updated = [...educations];
    updated[eduIndex].achievements[achIndex] = value;
    setEducations(updated);
  };

  const removeAchievement = (eduIndex, achIndex) => {
    const updated = [...educations];
    updated[eduIndex].achievements = updated[eduIndex].achievements.filter((_, i) => i !== achIndex);
    setEducations(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap size={20} />
            Education
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Add your educational background
          </p>
        </div>
        <button
          onClick={addEducation}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>

      <div className="space-y-6">
        {educations.map((edu, eduIndex) => (
          <div key={eduIndex} className="border border-gray-200 rounded-lg p-6 relative">
            {educations.length > 1 && (
              <button
                onClick={() => removeEducation(eduIndex)}
                className="absolute right-2 top-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            )}

            <div className="space-y-4">
              {/* Degree & Institution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(eduIndex, 'degree', e.target.value)}
                    placeholder="Bachelor of Technology"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(eduIndex, 'institution', e.target.value)}
                    placeholder="IIT Bombay"
                    className="input"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => updateEducation(eduIndex, 'location', e.target.value)}
                  placeholder="Mumbai, India"
                  className="input"
                />
              </div>

              {/* Dates & GPA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(eduIndex, 'startDate', e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(eduIndex, 'endDate', e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA/Percentage
                  </label>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(eduIndex, 'gpa', e.target.value)}
                    placeholder="8.5/10"
                    className="input"
                  />
                </div>
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Achievements (Optional)
                  </label>
                  <button
                    onClick={() => addAchievement(eduIndex)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add
                  </button>
                </div>
                
                <div className="space-y-2">
                  {edu.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => updateAchievement(eduIndex, achIndex, e.target.value)}
                        placeholder="Dean's List, Published research paper..."
                        className="input flex-1"
                      />
                      {edu.achievements.length > 1 && (
                        <button
                          onClick={() => removeAchievement(eduIndex, achIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;