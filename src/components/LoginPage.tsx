import { useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    // Here you would typically make an API call to verify the user's credentials
    // For this mockup, we'll just assume the login is successful if both fields are non-empty
    if (username && password) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay in the API call
      router.push("/robotportal");
    } else {
      setErrorMessage("Please enter both a username and password.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-500">
      <h1 className="text-4xl font-bold mb-8">Robot Portal Login</h1>

      <div className="max-w-md w-full px-8 py-6 bg-white shadow-md rounded-md">
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className={classNames(
              "w-full px-3 py-2 border border-gray-400 rounded-md",
              { "bg-gray-100": isLoading }
            )}
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className={classNames(
              "w-full px-3 py-2 border border-gray-400 rounded-md",
              { "bg-gray-100": isLoading }
            )}
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <button
          className={classNames(
            "w-full px-4 py-2 rounded-md text-white font-bold text-center",
            { "bg-gray-400 cursor-not-allowed": isLoading },
            { "bg-blue-600 hover:bg-blue-700": !isLoading },
          )}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;