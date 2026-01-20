import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Documentation from "./pages/Documentation";
import Methodology from "./pages/Methodology";
import Indicators from "./pages/Indicators";
import NewEvaluation from "./pages/NewEvaluation";
import EvaluationList from "./pages/EvaluationList";
import EvaluationDetail from "./pages/EvaluationDetail";
import ComprehensiveEvaluation from "./pages/ComprehensiveEvaluation";
import EvaluationReport from "./pages/EvaluationReport";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import ReviewPage from "./pages/ReviewPage";
import ConsensusDashboard from "./pages/ConsensusDashboard";
import ComparisonDashboard from "./pages/ComparisonDashboard";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path={"/"} component={Home} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/methodology" component={Methodology} />
      <Route path="/indicators" component={Indicators} />
      <Route path="/new" component={NewEvaluation} />
      <Route path="/evaluations" component={EvaluationList} />
      <Route path="/evaluations/:id" component={EvaluationDetail} />
      <Route path="/evaluation/comprehensive/:id" component={ComprehensiveEvaluation} />
      <Route path="/evaluation/report/:id" component={EvaluationReport} />
      <Route path="/reviewer" component={ReviewerDashboard} />
      <Route path="/review/:id" component={ReviewPage} />
      <Route path="/consensus" component={ConsensusDashboard} />
      <Route path="/compare" component={ComparisonDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/register" component={Register} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
