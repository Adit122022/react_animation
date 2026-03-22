import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';

const ResumePreview = ({ resume }) => {
  const templates = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    creative: CreativeTemplate,
  };

  const TemplateComponent = templates[resume?.template] || ModernTemplate;

  return (
    <div className="bg-white">
      <div className="transform scale-75 origin-top-left" style={{ width: '133.33%' }}>
        <TemplateComponent data={resume} />
      </div>
    </div>
  );
};

export default ResumePreview;