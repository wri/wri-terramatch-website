import React from "react";

const EditControl = ({ onClick }: { onClick?: any }) => {
  return (
    <button
      id="buttonEditPolygon"
      onClick={onClick}
      style={{
        backgroundColor: "#FFA500",
        borderRadius: "5px",
        padding: "10px 20px",
        color: "white",
        border: "none",
        cursor: "pointer",
        outline: "none"
      }}
    >
      Edit Polygon
    </button>
  );
};

export default EditControl;
