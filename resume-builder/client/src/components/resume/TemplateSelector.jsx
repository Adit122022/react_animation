import { useState } from 'react';
import { Check } from 'lucide-react';

const TemplateSelector = ({ selectedTemplate, onSelect }) => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and professional design',
      thumbnail: '/templates/modern-thumb.png',
      isPremium: false,
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional ATS-friendly layout',
      thumbnail: '/templates/classic-thumb.png',
      isPremium: false,
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Stand out with bold design',
      thumbnail: '/templates/creative-thumb.png',
      isPremium: true,
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant',
      thumbnail: '/templates/minimal-thumb.png',
      isPremium: true,
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Choose Template</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => !template.isPremium && onSelect(template.id)}
            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            } ${template.isPremium ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {/* Thumbnail */}
            <div className="aspect-[3/4] bg-gray-100 rounded-md mb-3 flex items-center justify-center">
              <span className="text-4xl">{template.id === 'modern' ? '📄' : template.id === 'classic' ? '📋' : '🎨'}</span>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold">{template.name}</h4>
                {template.isPremium && (
                  <span className="badge badge-warning text-xs">PRO</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>

            {/* Selected Check */}
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <Check size={16} className="text-white" />
              </div>
            )}

            {/* Premium Overlay */}
            {template.isPremium && (
              <div className="absolute inset-0 bg-black/5 rounded-lg flex items-center justify-center">
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  Upgrade to unlock
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;