import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Eye, Palette, Sparkles } from 'lucide-react';
import { TEMPLATES, type TemplateOption } from '@/lib/types';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

export default function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    onTemplateChange(templateId);
  };

  // Function to render template-specific mockups
  const renderTemplateMockup = (templateId: string) => {
    switch (templateId) {
      case 'modern':
        return (
          <div>
            <div className="border-l-2 border-blue-500 pl-2 mb-2">
              <div className="h-2 bg-gray-800 w-16 mb-1 rounded"></div>
              <div className="h-1 bg-blue-500 w-12 rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-300 w-full rounded"></div>
              <div className="h-1 bg-gray-300 w-3/4 rounded"></div>
            </div>
          </div>
        );
      case 'classic':
        return (
          <div>
            <div className="text-center border-b border-gray-300 pb-1 mb-2">
              <div className="h-2 bg-gray-800 w-16 mx-auto mb-1 rounded"></div>
              <div className="h-1 bg-gray-500 w-20 mx-auto rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-300 w-full rounded"></div>
              <div className="h-1 bg-gray-300 w-4/5 rounded"></div>
            </div>
          </div>
        );
      case 'creative':
        return (
          <div>
            <div className="bg-gradient-to-r from-purple-200 to-blue-200 p-1 rounded mb-2">
              <div className="h-2 bg-white w-16 mx-auto mb-1 rounded"></div>
              <div className="h-1 bg-purple-300 w-12 mx-auto rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-300 w-full rounded"></div>
              <div className="h-1 bg-gray-300 w-3/4 rounded"></div>
            </div>
          </div>
        );
      case 'minimalist':
        return (
          <div>
            <div className="mb-3">
              <div className="h-2 bg-gray-600 w-20 mb-2 rounded font-light"></div>
              <div className="h-1 bg-gray-400 w-16 rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-200 w-full rounded"></div>
              <div className="h-1 bg-gray-200 w-2/3 rounded"></div>
            </div>
          </div>
        );
      case 'executive':
        return (
          <div>
            <div className="bg-gray-800 text-white p-1 -m-1 mb-2 rounded-t">
              <div className="h-2 bg-white w-16 mb-1 rounded"></div>
              <div className="h-1 bg-gray-300 w-12 rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-gray-300 w-full rounded"></div>
              <div className="h-1 bg-gray-300 w-4/5 rounded"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center mb-2">
            <div className="h-3 bg-gray-800 w-20 mx-auto mb-1 rounded"></div>
            <div className="h-2 bg-gray-600 w-16 mx-auto mb-1 rounded"></div>
            <div className="h-1 bg-gray-400 w-24 mx-auto rounded"></div>
          </div>
        );
    }
  };

  const TemplatePreview = ({ template }: { template: TemplateOption }) => {
    const isSelected = selectedTemplate === template.id;
    const isHovered = hoveredTemplate === template.id;
    
    return (
      <Card 
        className={`group cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${
          isSelected ? 'ring-2 ring-primary border-primary shadow-lg' : 'border-border hover:border-primary/50'
        }`}
        onClick={() => handleTemplateSelect(template.id)}
        onMouseEnter={() => setHoveredTemplate(template.id)}
        onMouseLeave={() => setHoveredTemplate(null)}
      >
        <CardContent className="p-0">
          {/* Template Preview Image */}
          <div className="relative overflow-hidden rounded-t-lg">
            <div className={`h-52 bg-gradient-to-br p-4 transition-all duration-300 ${getTemplateGradient(template.id)} ${
              isHovered ? 'brightness-110' : ''
            }`}>
              {/* Enhanced mock resume layout based on template */}
              <div className={`bg-white rounded shadow-sm p-3 h-full text-xs overflow-hidden transition-all duration-300 ${
                isHovered ? 'shadow-lg transform scale-105' : ''
              }`}>
                {renderTemplateMockup(template.id)}
              </div>
              
              {/* Hover overlay */}
              {isHovered && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-t-lg">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                </div>
              )}
            </div>
            
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1.5 shadow-lg">
                <CheckCircle className="h-4 w-4" />
              </div>
            )}
          </div>
          
          {/* Template Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{template.name}</h3>
              {template.popular && (
                <Badge variant="secondary" className="text-xs px-2 py-1 bg-orange-100 text-orange-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
            
            {/* Template features */}
            <div className="space-y-1">
              {getTemplateFeatures(template.id).map((feature, idx) => (
                <div key={idx} className="flex items-center text-xs text-muted-foreground">
                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                  {feature}
                </div>
              ))}
            </div>
            
            {/* Select button */}
            <Button 
              variant={isSelected ? "default" : "outline"} 
              size="sm" 
              className="w-full mt-3 transition-all duration-200"
            >
              {isSelected ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Selected
                </>
              ) : (
                <>
                  <Palette className="h-3 w-3 mr-1" />
                  Use Template
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Template</h2>
        <p className="text-muted-foreground">
          Select a professional template that matches your style and industry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => (
          <TemplatePreview key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}

function getTemplateGradient(templateId: string): string {
  const gradients = {
    modern: 'from-blue-400 to-blue-600',
    classic: 'from-gray-400 to-gray-600',
    creative: 'from-purple-400 to-pink-500',
    minimalist: 'from-gray-300 to-gray-500',
    executive: 'from-gray-700 to-gray-900',
  };
  return gradients[templateId as keyof typeof gradients] || gradients.modern;
}

function getTemplateFeatures(templateId: string): string[] {
  const features = {
    modern: ['Clean design', 'ATS-friendly', 'Blue accent colors'],
    classic: ['Traditional layout', 'Conservative style', 'Professional'],
    creative: ['Colorful design', 'Creative industries', 'Eye-catching'],
    minimalist: ['Simple & elegant', 'Lots of white space', 'Modern typography'],
    executive: ['Professional look', 'Corporate style', 'Leadership focused'],
  };
  return features[templateId as keyof typeof features] || features.modern;
}