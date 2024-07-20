import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import Navbar from "../layout/Navbar";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Navbar />
      <main className="grid h-screen w-screen grid-rows-3 font-poppins">
        <section className="row-span-1 flex flex-col items-center justify-end">
          <article className="space-y-2 text-center">
            <p className="text-4xl font-medium">
              Empower your next project <br /> Through API Hunt
            </p>
            <p>
              Improve your application's with different kinds of api <br />
              to choose from.
            </p>
          </article>
          <button
            onClick={() => navigate("/SignUp")}
            className="mt-4 h-10 w-40 rounded-md bg-black"
          >
            <p className="text-white">Sign Up Now</p>
          </button>
        </section>
        <section className="row-span-2 flex flex-row items-center justify-center">
          <img src="/bg/landingpage.svg" className="h-[70%] w-[90%]" />
        </section>
      </main>
    </Layout>
  );
}

export default LandingPage;
