import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import LandingPage from '@/pages/LandingPage';
import ResumeBuilder from '@/pages/ResumeBuilder';
import JobTailoring from '@/pages/JobTailoring';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/not-found';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  console.log('App component rendered');
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen gradient-bg">
        <Navigation />
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/builder" component={ResumeBuilder} />
          <Route path="/builder/:id" component={ResumeBuilder} />
          <Route path="/tailoring/:id" component={JobTailoring} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;