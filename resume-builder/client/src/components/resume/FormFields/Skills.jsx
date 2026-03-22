import { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';

const Skills = ({ data, onChange }) => {
  const [skills, setSkills] = useState({
    technical: [],
    soft: [],
    languages: [],
    ...data,
  });

  const [inputValues, setInputValues] = useState({
    technical: '',
    soft: '',
    languages: '',
  });

  useEffect(() => {
    onChange(skills);
  }, [skills]);

  const addSkill = (category) => {
    const value = inputValues[category].trim();
    if (value && !skills[category].includes(value)) {
      setSkills(prev => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
      setInputValues(prev => ({
        ...prev,
        [category]: '',
      }));
    }
  };

  const removeSkill = (category, index) => {
    setSkills(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleKeyPress = (e, category) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(category);
    }
  };

  const suggestedSkills = {
    technical: [
      'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
      'Java', 'SQL', 'MongoDB', 'AWS', 'Docker'
    ],
    soft: [
      'Leadership', 'Communication', 'Team Player', 'Problem Solving',
      'Critical Thinking', 'Time Management', 'Adaptability'
    ],
    languages: [
      'English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin'
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap size={20} />
          Skills
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Add your professional and personal skills
        </p>
      </div>

      {/* Technical Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Technical Skills
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputValues.technical}
            onChange={(e) => setInputValues(prev => ({
              ...prev,
              technical: e.target.value,
            }))}
            onKeyPress={(e) => handleKeyPress(e, 'technical')}
            placeholder="Type and press Enter"
            className="input flex-1"
          />
          <button
            onClick={() => addSkill('technical')}
            className="btn btn-primary"
          >
            Add
          </button>
        </div>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.technical.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
            >
              {skill}
              <button
                onClick={() => removeSkill('technical', index)}
                className="hover:text-primary-900"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Suggestions:</span>
          {suggestedSkills.technical
            .filter(s => !skills.technical.includes(s))
            .slice(0, 5)
            .map((skill, index) => (
              <button
                key={index}
                onClick={() => {
                  setSkills(prev => ({
                    ...prev,
                    technical: [...prev.technical, skill],
                  }));
                }}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
              >
                + {skill}
              </button>
            ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Soft Skills
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputValues.soft}
            onChange={(e) => setInputValues(prev => ({
              ...prev,
              soft: e.target.value,
            }))}
            onKeyPress={(e) => handleKeyPress(e, 'soft')}
            placeholder="Type and press Enter"
            className="input flex-1"
          />
          <button
            onClick={() => addSkill('soft')}
            className="btn btn-primary"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {skills.soft.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
            >
              {skill}
              <button
                onClick={() => removeSkill('soft', index)}
                className="hover:text-green-900"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Suggestions:</span>
          {suggestedSkills.soft
            .filter(s => !skills.soft.includes(s))
            .slice(0, 5)
            .map((skill, index) => (
              <button
                key={index}
                onClick={() => {
                  setSkills(prev => ({
                    ...prev,
                    soft: [...prev.soft, skill],
                  }));
                }}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
              >
                + {skill}
              </button>
            ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputValues.languages}
            onChange={(e) => setInputValues(prev => ({
              ...prev,
              languages: e.target.value,
            }))}
            onKeyPress={(e) => handleKeyPress(e, 'languages')}
            placeholder="Type and press Enter"
            className="input flex-1"
          />
          <button
            onClick={() => addSkill('languages')}
            className="btn btn-primary"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {skills.languages.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
            >
              {skill}
              <button
                onClick={() => removeSkill('languages', index)}
                className="hover:text-purple-900"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Suggestions:</span>
          {suggestedSkills.languages
            .filter(s => !skills.languages.includes(s))
            .slice(0, 4)
            .map((skill, index) => (
              <button
                key={index}
                onClick={() => {
                  setSkills(prev => ({
                    ...prev,
                    languages: [...prev.languages, skill],
                  }));
                }}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
              >
                + {skill}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;