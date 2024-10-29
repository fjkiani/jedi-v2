import React, { useEffect, useState } from "react";
import { getAuthors } from "@/services"; // Ensure this path matches your file structure
import "./app.css"; // Ensure this CSS is applied

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const authorsData = await getAuthors();
      setTeamMembers(authorsData);
    };

    fetchTeamMembers();
  }, []);

  return (
    <section className="section-white">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h2 className="section-title">The Team Behind Edulga.ai</h2>
          </div>
          {/* Render team members */}
          <div className="team-container">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-item">
                <img src={member.photo.url} alt={member.name} className="team-img" />
                <h3>{member.name}</h3>
                <p className="team-info">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
