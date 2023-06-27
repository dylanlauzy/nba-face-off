import { useRouteError } from "react-router-dom"

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);
  
  return (
    <div>{error.message}</div>
  )
}

export default ErrorPage