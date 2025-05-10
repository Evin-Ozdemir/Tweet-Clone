import { useOutletContext } from "react-router-dom";
import Aside from "./aside";
import Nav from "./nav";
import Main from "./main";

const Feed = () => {
  // Outlet'e context prop'u olarak gönderilen veriye erişme
  const user = useOutletContext();

  return (
    <div className="h-screen bg-primary overflow-hidden text-secondary grid grid-cols-[1fr_minmax(300px,600px)_1fr]">
      <Nav user={user} />
      <Main user={user} />
      <Aside />
    </div>
  );
};

export default Feed;
