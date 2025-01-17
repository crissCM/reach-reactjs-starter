import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import THEME, { getTheme, themeState } from "theme/index";
import routes from "routes/index";
import FullScreenLoader from "components/Common/FullscreenLoader";
import AppHeader from "AppHeader";
import "./App.scss";
import { UIThemeType } from "types/shared";
import ActiveNotifications from "components/ActiveNotifications";
import WalletNotFound from "components/Reach/WalletNotFound";
import store from "state";

function App() {
  const sTheme = getTheme();
  const [theme, setTheme] = useState(THEME[sTheme] || {});
  const [user, setUser] = useState("");

  useEffect(() => {
    /* Change your document title here */
    document.title = "Reach + ReactJS Starter App";

    /* Listen to theme changes; you can build on this functionality */
    const onTheme = (s: any) => setTheme(THEME[s.theme as UIThemeType]);

    /**
     * This is how you 1. Subscribe to a state, and 2. Get an 'unsubscribe' function.
     * Over here, the App.tsx component is listening to two different state instances;
     * one for just theme stuff, one for data that will come from using stdlib.
     * You can create as many state instances (like `themeState` and `store`) as you need.
     */
    const unsubTheme = themeState.subscribeToKeys(onTheme, ["theme"]);
    const unsubReach = store.subscribeToKeys(
      (s) => setUser(s.address || ""),
      ["address"]
    );

    return function unsubAll() {
      unsubTheme();
      unsubReach();
    };
  });

  return (
    <ThemeProvider theme={theme}>
      <THEME.GLOBAL />

      <ActiveNotifications />

      <React.Suspense fallback={<FullScreenLoader />}>
        <Router>
          <section className="App">
            {/* App Header */}
            <AppHeader />

            {/* Routes */}
            {user ? (
              <Switch>
                {routes.map(({ path, component, render }) => (
                  <Route
                    exact
                    path={path}
                    component={component}
                    key={path}
                    render={render}
                  />
                ))}
              </Switch>
            ) : (
              <WalletNotFound />
            )}
          </section>
        </Router>
      </React.Suspense>
    </ThemeProvider>
  );
}

export default App;
