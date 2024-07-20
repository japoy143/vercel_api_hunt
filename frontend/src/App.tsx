import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserPage from "./pages/UserPage";
import SignIn from "./pages/SignInPage";
import SignUp from "./pages/SignUp_Page";
import { Toaster } from "sonner";

const persistor = persistStore(store);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <LandingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/Login",
    element: <SignIn />,
  },
  {
    path: "/SignUp",
    element: <SignUp />,
  },
  {
    path: "/User",
    element: (
      <ProtectedRoute>
        <UserPage />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <main className="h-screen w-screen overflow-hidden">
            <Toaster position="top-center" duration={1500} />
            <RouterProvider router={router} />
          </main>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}

export default App;
