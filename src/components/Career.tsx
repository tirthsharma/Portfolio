import "./styles/Career.css";

const experiences = [
  {
    position: "Computer Teacher, Software & Hardware",
    company: "Krish Computers",
    dates: "2024 - 2025",
    description:
      "Taught software and hardware fundamentals while helping students build practical computer skills.",
  },
  {
    position: "Computer Operator & Social Media Manager",
    company: "Honda SHH",
    dates: "2025 - 2026",
    description:
      "Managed computer operations while also handling social media and digital content.",
  },
  {
    position: "Freelance Video Editor",
    company: "Independent",
    dates: "ONGOING",
    description:
      "Edited videos for clients with a focus on storytelling, pacing, sound design, and visual quality.",
  },
  {
    position: "Trainer, Video Editor & People Manager",
    company: "Tharun Speaks",
    dates: "2026 - PRESENT",
    description:
      "Trained 3,000+ editors and placed 200+ candidates in companies, handling sales, people management, content writing, video editing and speaking sessions.",
  },
];

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {experiences.map(({ position, company, dates, description }) => (
            <div className="career-info-box" key={`${position}-${company}`}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{position}</h4>
                  <h5>{company}</h5>
                </div>
                <h3>{dates || ""}</h3>
              </div>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
