import { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, Eye, EyeOff } from 'lucide-react';

const SectionEditor = ({ 
  title, 
  icon, 
  children, 
  defaultExpanded = true,
  onToggleVisibility,
  isVisible = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      {/* Section Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 flex-1">
            {/* Drag Handle */}
            <button className="cursor-move text-gray-400 hover:text-gray-600">
              <GripVertical size={20} />
            </button>

            {/* Icon & Title */}
            <div className="flex items-center gap-2">
              {icon && <span className="text-xl">{icon}</span>}
              <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Visibility Toggle */}
            {onToggleVisibility && (
              <button
                onClick={onToggleVisibility}
                className={`p-2 rounded-lg transition-colors ${
                  isVisible 
                    ? 'text-gray-600 hover:bg-gray-200' 
                    : 'text-gray-400 hover:bg-gray-200'
                }`}
                title={isVisible ? 'Hide section' : 'Show section'}
              >
                {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            )}

            {/* Expand/Collapse */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-6 bg-white">
          {children}
        </div>
      )}

      {/* Collapsed State Info */}
      {!isExpanded && (
        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500 italic">
          Click to expand and edit this section
        </div>
      )}
    </div>
  );
};

export default SectionEditor;