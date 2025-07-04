import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Eye } from 'lucide-react';
import { TEMPLATES, type TemplateOption } from '@/lib/types';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

export default function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    onTemplateChange(templateId);
  };

  const TemplatePreview = ({ template }: { template: TemplateOption }) => {
    const isSelected = selectedTemplate === template.id;
    
    return (
      <Card 
        className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
          isSelected ? 'ring-2 ring-primary border-primary' : 'border-border hover:border-primary/50'
        }`}
        onClick={() => handleTemplateSelect(template.id)}
      >
        <CardContent className="p-0">
          {/* Template Preview Image */}
          <div className="relative overflow-hidden rounded-t-lg">
            <div className={`h-48 bg-gradient-to-br p-4 ${getTemplateGradient(template.id)}`}>
              {/* Mock resume layout */}
              <div className="bg-white rounded shadow-sm p-3 h-full text-xs overflow-hidden">
                <div className="text-center mb-2">
                  <div className="h-3 bg-gray-800 w-20 mx-auto mb-1 rounded"></div>
                  <div className="h-2 bg-gray-600 w-16 mx-auto mb-1 rounded"></div>
                  <div className="h-1 bg-gray-400 w-24 mx-auto rounded"></div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="h-1.5 bg-primary w-12 mb-1 rounded"></div>
                    <div className="space-y-0.5">
                      <div className="h-1 bg-gray-300 w-full rounded"></div>
                      <div className="h-1 bg-gray-300 w-4/5 rounded"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="h-1.5 bg-primary w-16 mb-1 rounded"></div>
                    <div className="space-y-0.5">
                      <div className="flex justify-between items-center">
                        <div className="h-1 bg-gray-600 w-20 rounded"></div>
                        <div className="h-1 bg-gray-400 w-8 rounded"></div>
                      </div>
                      <div className="h-1 bg-gray-400 w-16 rounded"></div>
                      <div className="space-y-0.5">
                        <div className="h-0.5 bg-gray-300 w-full rounded"></div>
                        <div className="h-0.5 bg-gray-300 w-5/6 rounded"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="h-1.5 bg-primary w-10 mb-1 rounded"></div>
                    <div className="flex flex-wrap gap-1">
                      <div className="h-1.5 bg-blue-100 w-8 rounded-full"></div>
                      <div className="h-1.5 bg-blue-100 w-6 rounded-full"></div>
                      <div className="h-1.5 bg-blue-100 w-10 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Selected Indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
            )}

            {/* Preview Button */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewTemplate(template.id);
                }}
              >
                <Eye className="mr-2 h-3 w-3" />
                Preview
              </Button>
            </div>
          </div>

          {/* Template Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground">{template.name}</h3>
              {template.popular && (
                <Badge variant="secondary" className="text-xs">
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {getTemplateFeatures(template.id).map((feature, index) => (
                    <div
                      key={index}
                      className="w-2 h-2 rounded-full bg-primary/30"
                      title={feature}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {getTemplateFeatures(template.id).length} features
                </span>
              </div>
              
              <Button
                size="sm"
                variant={isSelected ? "default" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTemplateSelect(template.id);
                }}
                className={isSelected ? "bg-primary hover:bg-primary/90" : ""}
              >
                {isSelected ? 'Selected' : 'Use Template'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Choose Your Template</h3>
        <p className="text-sm text-muted-foreground">
          Select a professional template that matches your industry and personal style
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => (
          <TemplatePreview key={template.id} template={template} />
        ))}
      </div>

      {/* Template Features Info */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold text-foreground mb-4">All Templates Include:</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>ATS-optimized formatting</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Professional typography</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Print-ready PDF export</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Mobile-responsive design</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Customizable sections</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Industry-appropriate styling</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-primary mr-3" />
              <div>
                <p className="font-medium text-foreground">
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.name} Selected
                </p>
                <p className="text-sm text-muted-foreground">
                  Your resume will use this template for PDF export and live preview
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper functions
function getTemplateGradient(templateId: string): string {
  const gradients = {
    modern: 'from-blue-500 to-purple-600',
    executive: 'from-slate-600 to-slate-800',
    creative: 'from-green-500 to-teal-600',
  };
  return gradients[templateId as keyof typeof gradients] || gradients.modern;
}

function getTemplateFeatures(templateId: string): string[] {
  const features = {
    modern: ['Clean Layout', 'Color Accents', 'Modern Typography', 'Tech-Friendly'],
    executive: ['Traditional', 'Professional', 'Corporate', 'Conservative'],
    creative: ['Unique Design', 'Stand Out', 'Creative Fields', 'Visual Appeal'],
  };
  return features[templateId as keyof typeof features] || features.modern;
}
