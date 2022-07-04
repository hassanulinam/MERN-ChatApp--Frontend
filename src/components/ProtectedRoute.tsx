import { Redirect, Route } from "react-router-dom";
// import { ChatState } from "../context/ChatProvider";

const ProtectedRoute = (props: any) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
  // const { setUser } = ChatState();
  // setUser(userInfo);

  if (userInfo?.token === undefined) return <Redirect to="/" />;

  return <Route {...props} />;
};

export default ProtectedRoute;
