import knight from "../assests/svgs/knight2.svg";
import "../styles/loading.css";

function Loading() {
  return (
    <div className="loading-container">
      <img
        src={knight}
        alt="Chess knight loading animation"
        className="loading-knight"
      />
      <p>Loading Chess DNA...</p>
    </div>
  );
}

export default Loading;