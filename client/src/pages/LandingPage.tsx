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

  const testimonials = [
    {
      content: 'The AI tailoring feature is incredible. I landed 3 interviews in the first week after optimizing my resume for specific job descriptions.',
      author: 'Sarah Chen',
      role: 'Software Engineer at Google',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      content: 'The file upload feature saved me hours. It extracted all my information perfectly and the templates look so professional.',
      author: 'Marcus Johnson',
      role: 'Marketing Manager at Stripe',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      content: 'Finally got past the ATS systems! The skill matching feature showed me exactly what keywords I was missing.',
      author: 'David Rodriguez',
      role: 'Product Designer at Figma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
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
                <Button size="lg" className="accent-primary text-white hover:opacity-90 text-lg px-8 py-4 border-0">
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

          {/* Demo Interface Preview */}
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden shadow-2xl card-enhanced border">
              <div className="bg-card px-6 py-4 flex items-center space-x-2 border-b border-border">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground text-sm ml-4">Rapid CV - Resume Builder</span>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-8 border-r border-border">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Build Your Resume</h3>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center mb-6 hover:border-primary/50 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground font-medium">Drop your resume here</p>
                    <p className="text-sm text-muted-foreground">PDF, DOCX up to 10MB</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                      <input type="text" className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground" placeholder="John Doe" readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Professional Summary</label>
                      <textarea className="w-full px-4 py-3 bg-input border border-border rounded-lg h-24 resize-none text-foreground" placeholder="Experienced software developer..." readOnly />
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Live Preview</h3>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <FileDown className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6 border h-96 overflow-hidden">
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-slate-900">John Doe</h4>
                      <p className="text-slate-600">Software Developer</p>
                      <p className="text-sm text-slate-500">john.doe@email.com | (555) 123-4567</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-slate-800 border-b border-slate-200 pb-1">Summary</h5>
                        <p className="text-sm text-slate-600 mt-2">Experienced software developer with 5+ years...</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-800 border-b border-slate-200 pb-1">Experience</h5>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-slate-700">Senior Developer - Tech Corp</p>
                          <p className="text-xs text-slate-500">2021 - Present</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
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

      {/* AI Demo Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">See AI Tailoring in Action</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Paste a job description and watch how our AI optimizes your resume for maximum impact.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">1. Paste Job Description</h3>
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <label className="block text-sm font-medium text-slate-300 mb-3">Job Description</label>
                  <textarea 
                    className="w-full h-40 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none" 
                    placeholder="We are looking for a Senior Software Engineer with expertise in React, Node.js, and cloud technologies. The ideal candidate will have 5+ years of experience building scalable web applications..."
                    readOnly
                  />
                  <Button className="mt-4 w-full bg-primary hover:bg-primary/90">
                    <Zap className="mr-2 h-4 w-4" />
                    Analyze & Tailor Resume
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">2. AI Optimization Results</h3>
              <div className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-green-400 mb-3">
                      <CheckCircle className="inline mr-2 h-4 w-4" />
                      Skills Matched (8/10)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-green-900 text-green-300">React</Badge>
                      <Badge variant="secondary" className="bg-green-900 text-green-300">Node.js</Badge>
                      <Badge variant="secondary" className="bg-green-900 text-green-300">JavaScript</Badge>
                      <Badge variant="secondary" className="bg-yellow-900 text-yellow-300">AWS</Badge>
                      <Badge variant="secondary" className="bg-red-900 text-red-300">Docker</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-blue-400 mb-3">
                      <Brain className="inline mr-2 h-4 w-4" />
                      AI-Enhanced Summary
                    </h4>
                    <p className="text-slate-300 text-sm">
                      "Senior Software Engineer with 6+ years building scalable web applications using React and Node.js. Proven expertise in cloud technologies and modern development practices..."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Success Stories</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how Replit 2.0 helped professionals land their dream jobs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
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
