import { NavigateOptions, To } from "react-router-dom";

type MenuProps = {
  signUp: (to: To, options?: NavigateOptions) => void;
  logIn: (to: To, options?: NavigateOptions) => void;
};

function Menu({ signUp, logIn }: MenuProps) {
  return (
    <>
      <button
        onClick={() => signUp("/SignUp", {})}
        className=" h-6 w-18 bg-black rounded text-white  text-sm "
      >
        Sign up
      </button>
      <button
        onClick={() => logIn("/Login", {})}
        className=" h-6 w-18 bg-black rounded text-white text-sm"
      >
        Login
      </button>
    </>
  );
}

export default Menu;
