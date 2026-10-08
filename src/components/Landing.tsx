import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              <span className="landing-name-first">TIRTH</span>
              <br />
              <span className="landing-name-last">SHARMA</span>
            </h1>
          </div>
          <div className="landing-info">
            <h2>A Creative</h2>
            <h1>
              <span className="landing-role-editor">VIDEO EDITOR</span>
              <br />
              <span className="landing-role-designer">MOTION DESIGNER</span>
            </h1>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
