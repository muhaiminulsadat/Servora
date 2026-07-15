import {RouterProvider} from "react-router-dom";
import {ThemeProvider} from "@/components/theme-provider";
import {routes} from "./app/routes";

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="">
        <RouterProvider router={routes} />
      </div>
    </ThemeProvider>
  );
};
export default App;
