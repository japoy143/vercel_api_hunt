import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div>
      <p>Page not Found</p>
      <Link to={"/"}>Home</Link>
    </div>
  );
}

export default PageNotFound;
