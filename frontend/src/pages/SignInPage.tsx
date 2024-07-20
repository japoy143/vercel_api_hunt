import { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/AuthSlice";
import { toast } from "sonner";

function SignIn() {
  const navigate = useNavigate();
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const dispatch = useDispatch();

  //for passing tokens if the credential is not true it cannot pass cookies
  axios.defaults.withCredentials = true;

  const Login = async (Email: string, Password: string) => {
    const user = await axios.post("/Users/Login", {
      email: Email,
      password: Password,
    });

    if (user.data.Message === "Success") {
      const { email, id, accessToken, avatar, likes } = user.data;
      if (!accessToken) return toast.error("Unauthorize User");
      //passing user details to the global state
      dispatch(
        login({
          email,
          id,
          avatar,
          accessToken,
          likes: likes,
        }),
      );
      console.log(user.data);
      toast.success("Login Successfully");
      navigate("/");
      // autoLogout();
    }
    //handling errors
    if (user.data === "Incorrect Password") {
      console.log("Error", user.data);
      toast.warning("Incorrect Password");
      console.log(user.status);
    }

    if (user.status === 203) {
      console.log("Error", user.data);
      toast.warning("Please Create An Account");
    }
    console.log(user.status);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Login(Email, Password);
  };

  return (
    <div className="relative h-full w-full">
      <div className="grid h-full w-full grid-cols-4">
        <div></div>
        <div className="col-span-3 h-full w-full place-content-center">
          <img src="/bg/bg.svg" className="h-[70%] w-[100%]" />
        </div>
      </div>
      {/* Login Form*/}
      <div className="absolute top-0 grid h-full w-full grid-cols-2">
        <div className="col-span-1 flex flex-col justify-center space-y-2 rounded-md bg-gray-400 bg-opacity-10 bg-clip-padding backdrop-blur-sm backdrop-filter xs:px-10 sm:px-14 md:px-14 lg:px-28 xl:px-52">
          <div className="flex flex-row items-center justify-center space-x-4">
            <img src="/icons/confetti.svg" className="h-4 w-4 -rotate-90" />
            <p className="text-center font-poppins text-2xl font-medium text-primary">
              API Hunt
            </p>
            <img src="/icons/confetti.svg" className="h-4 w-4" />
          </div>
          <p className="text-center font-poppins font-medium">
            Sign in to your Account
          </p>

          <form className="space-y-4 font-poppins" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="mail">
                Email
                <input
                  className="mb-2 mt-2 h-8 w-[100%] rounded pl-2"
                  id="mail"
                  type="email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                />
              </label>
            </div>
            <div>
              <label htmlFor="pwd">
                Password
                <input
                  className="mb-2 mt-2 h-8 w-[100%] rounded pl-2"
                  id="pwd"
                  type="password"
                  autoComplete="off"
                  value={Password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <div className="flex flex-row justify-between text-sm font-semibold underline">
              <Link to={"/SignUp"}> Create An Account</Link>
              <p>Forgot Password</p>
            </div>
            <div className="flex flex-row justify-center">
              <button
                className="bg-primary h-10 w-28 rounded-md border-2 font-semibold"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
          <br />
        </div>
      </div>
    </div>
  );
}

export default SignIn;
