import React from "react";

export const Profile = () => {
  return (
    <div style={{ maxWidth: 780, margin: "0 auto" }}>
      <h1 className="page-title">Profile</h1>

      {/* Avatar */}
      <div className="profile-avatar-wrap">
        <div className="profile-avatar">
          {/* Generic user silhouette SVG */}
          <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" width="140" height="140">
            <circle cx="70" cy="70" r="70" fill="#E5E7EB" />
            <circle cx="70" cy="54" r="24" fill="#9CA3AF" />
            <ellipse cx="70" cy="115" rx="38" ry="28" fill="#9CA3AF" />
          </svg>
        </div>
      </div>

      {/* Information card */}
      <div className="profile-card">
        <div className="profile-card-title">Information</div>
        <div className="profile-fields">
          <div className="profile-field">
            <label>Name</label>
            <div className="field-value">Bùi Thanh Tân</div>
          </div>
          <div className="profile-field">
            <label>Birthday</label>
            <div className="field-value">29/04/2004</div>
          </div>
          <div className="profile-field">
            <label>Email</label>
            <div className="field-value">tanbtt29042004@gmail.com</div>
          </div>
          <div className="profile-field">
            <label>Phone</label>
            <div className="field-value">0869807314</div>
          </div>
        </div>
      </div>

      {/* Project card */}
      <div className="profile-card">
        <div className="profile-card-title">Project</div>
        <div className="profile-fields-single">
          <div className="profile-field">
            <label>GitHub</label>
            <a
              href="https://github.com/tantan294"
              className="field-link"
              target="_blank"
              rel="noreferrer"
            >
              https://github.com/tantan294
            </a>
          </div>
          <div className="profile-field">
            <label>Figma</label>
            <a
              href="https://www.figma.com/design/XNpoLzuJiXOgz7MM8sAFYj/iot?node-id=108-255&t=1qApKmeAtOg2cHtc-1"
              className="field-link"
              target="_blank"
              rel="noreferrer"
            >
              https://www.figma.com/design/XNpoLzuJiXOgz7MM8sAFYj/iot?node-id=108-255&t=1qApKmeAtOg2cHtc-1
            </a>
          </div>
          <div className="profile-field">
            <label>PDF</label>
            <span className="field-link" style={{ cursor: "default" }}>DOWNLOAD</span>
          </div>
        </div>
      </div>
    </div>
  );
};
