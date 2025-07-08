import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';
import { 
  Rocket, Upload, Brain, Eye, ALargeSmall, FileText, 
  Target, CheckCircle, Star, Code, FileDown, Edit3,
  Zap, Shield, Users, Clock, ArrowRight, Github,
  Twitter, Linkedin
} from 'lucide-react';

export default function LandingPage() {
  // Debug log to ensure component is loading
  console.log('LandingPage component loaded');
  
  const handleTestClick = () => {
    console.log('Test button clicked!');
    alert('Interface is working! You can interact with the application.');
  };
  const features = [
    {
      icon: Brain,
      title: 'AI Job Matching',
      description: 'Paste any job description and our AI will automatically tailor your resume to match key requirements and optimize for ATS systems.',
      color: 'accent-primary',
      iconColor: 'text-primary'
    },
    {
      icon: Upload,
      title: 'Smart File Import',
      description: 'Upload your existing PDF or Word resume and we\'ll extract all the content automatically. No manual retyping required.',
      color: 'accent-secondary',
      iconColor: 'text-secondary'
    },
    {
      icon: Eye,
      title: 'Real-time Preview',
      description: 'See your changes instantly with our live preview. What you see is exactly what recruiters will see in your final PDF.',
      color: 'accent-primary',
      iconColor: 'text-accent'
    },
    {
      icon: ALargeSmall,
      title: 'Professional Templates',
      description: 'Choose from multiple professionally designed templates. Clean, modern layouts that work across all industries.',
      color: 'accent-secondary',
      iconColor: 'text-primary'
    },
    {
      icon: FileText,
      title: 'One-Click Export',
      description: 'Export your resume to high-quality PDF with perfect formatting. Ready to send to any employer or upload to job boards.',
      color: 'accent-primary',
      iconColor: 'text-secondary'
    },
    {
      icon: Target,
      title: 'Skill Matching',
      description: 'Automatically highlight skills that match the job description. See which keywords you\'re missing for better ATS optimization.',
      color: 'from-teal-500 to-cyan-600',
      textColor: 'text-teal-600'
    }
  ];

  const steps = [
    {
      icon: Upload,
      title: 'Upload or Create',
      description: 'Upload your existing resume or start building from scratch using our intuitive form builder.',
      color: 'bg-primary'
    },
    {
      icon: Edit3,
      title: 'Edit & Customize',
      description: 'Use our live editor to update content, choose templates, and see changes in real-time.',
      color: 'bg-green-500'
    },
    {
      icon: Target,
      title: 'AI Tailor',
      description: 'Paste job descriptions and let our AI optimize your resume for each specific application.',
      color: 'bg-purple-500'
    },
    {
      icon: FileDown,
      title: 'Export & Apply',
      description: 'Download your polished resume as a PDF and start applying to your dream jobs.',
      color: 'bg-orange-500'
    }
  ];



  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-cyan-50/40 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-cyan-950/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <Logo size="lg" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Built for the Job You Want
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              AI-powered resume builder that tailors your experience to each job application. Create professional resumes, optimize for ATS systems, and land more interviews.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/builder">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-4 border-0">
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Building Now
                </Button>
              </Link>
              <Link href="/builder">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-primary text-primary hover:bg-primary/10">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Existing Resume
                </Button>
              </Link>
              <Button 
                onClick={handleTestClick}
                size="lg" 
                variant="secondary" 
                className="text-lg px-8 py-4 border-2 border-secondary text-secondary hover:bg-secondary/10"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Test Interface
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                ATS-Optimized
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-secondary mr-2" />
                Secure & Private
              </div>
              <div className="flex items-center">
                <Brain className="h-4 w-4 text-accent mr-2" />
                AI-Powered
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features for Modern Job Seekers</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to create, optimize, and tailor professional resumes for any job application.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-all card-enhanced border hover:border-primary/50">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.color}`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className={`flex items-center ${feature.textColor} font-medium`}>
                  <span>Learn more</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* How It Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get from zero to hired-ready resume in just a few simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their careers with AI-powered resume optimization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/builder">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-blue-50">
                <Rocket className="mr-2 h-5 w-5" />
                Start Building For Free
              </Button>
            </Link>
            <Link href="/builder">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Upload className="mr-2 h-5 w-5" />
                Upload Existing Resume
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-blue-100">
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              10,000+ users trust us
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Resume ready in 5 minutes
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Replit 2.0</span>
              </div>
              <p className="text-slate-400 mb-4">
                AI-powered resume builder helping professionals land their dream jobs.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Github className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/builder" className="text-slate-400 hover:text-white transition-colors">Resume Builder</Link></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">AI Tailoring</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">PDF Export</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Career Tips</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Resume Examples</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Interview Guide</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Job Search</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400">&copy; 2024 Replit 2.0. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
