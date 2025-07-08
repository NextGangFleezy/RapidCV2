import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import LandingPage from '@/pages/LandingPage';
import ResumeBuilder from '@/pages/ResumeBuilder';
import JobTailoring from '@/pages/JobTailoring';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/not-found';

function App() {
  console.log('App component rendered');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      <main className="relative">
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/builder" component={ResumeBuilder} />
          <Route path="/builder/:id" component={ResumeBuilder} />
          <Route path="/tailor/:id" component={JobTailoring} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
