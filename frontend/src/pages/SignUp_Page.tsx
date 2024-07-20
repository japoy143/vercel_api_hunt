import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "../api/axios";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
const Register_Url = "/Users/SignUp";

function SignUp() {
  const navigation = useNavigate();

  const [email, setEmail] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [validMatch, setValidMatchPassword] = useState<boolean>(false);
  const [matchFocus, setMatchFocus] = useState<boolean>(false);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
  }, [password]);

  useEffect(() => {
    const match = password === confirmPassword;
    setValidMatchPassword(match);
  }, [password, confirmPassword]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const v1 = PWD_REGEX.test(password);
    if (!v1) {
      toast.error("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(Register_Url, {
        email,
        password,
        isLogin: false,
      });
      console.log(response.data.newUser.email);
      toast.success("Sign Up Successfully");
      navigation("/Login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (!err?.response) {
        toast.error("No Server Response");
      } else if (err.response?.status === 409) {
        toast.error("Email taken");
      }
    }
  };

  return (
    <section className="relative h-full w-full">
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
            Sign Up to your Account
          </p>

          <form className="font-poppins" onSubmit={handleSubmit}>
            <label className="" htmlFor="email">
              Email
            </label>
            <input
              className="mb-2 mt-2 h-8 w-[100%] rounded pl-2"
              type="email"
              id="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className=" " htmlFor="password">
              Password
            </label>
            <input
              className="mb-2 mt-2 h-8 w-[100%] rounded pl-2"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <p
              id="pwdnote"
              className={
                passwordFocus && !validPassword
                  ? "text-justify text-xs"
                  : "hidden"
              }
            >
              8 to 24 characters. <br />
              Must include uppercase and lowercase letters and a number.
            </p>

            <label className=" " htmlFor="confirmpassword">
              Confirm Password
            </label>
            <input
              className="mb-2 mt-2 h-8 w-[100%] rounded pl-2"
              type="password"
              id="confirmpassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="validmatchpassword"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p></p>
            <p
              id="validmatchpassword"
              className={
                matchFocus && !validMatch ? "text-justify text-xs" : "hidden"
              }
            >
              the password must match
            </p>

            <div className="mb-2 mt-4 flex flex-row items-center justify-center">
              <Link to={"/Login"} className="text-sm font-semibold underline">
                Already have an account?
              </Link>
            </div>

            <div className="flex flex-row justify-center">
              <button
                className="bg-primary h-10 w-28 rounded-md border-2 font-semibold"
                disabled={
                  !email || !validMatch || !validPassword ? true : false
                }
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
