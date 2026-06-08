import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Kurs from "./pages/Kurs";
import KursLogin from "./pages/KursLogin";
import KaufErfolg from "./pages/KaufErfolg";
import KaufAbbruch from "./pages/KaufAbbruch";
import Admin from "./pages/Admin";
import Bewertung from "./pages/Bewertung";
import CookieBanner from "./components/CookieBanner";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/kurs"} component={Kurs} />
      <Route path={"/kurs/login"} component={KursLogin} />
      <Route path={"/kauf/erfolg"} component={KaufErfolg} />
      <Route path={"/kauf/abbruch"} component={KaufAbbruch} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/bewertung"} component={Bewertung} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieBanner />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
