import React, { useEffect } from "react";

const EditControl = ({ onClick, onSave, onCancel }: { onClick?: any; onSave?: any; onCancel?: any }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  useEffect(() => {
    return () => {
      onCancel();
    };
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <button
        id="buttonEditPolygon"
        onClick={() => {
          setIsEditing(true);
          onClick();
        }}
        style={{
          backgroundColor: "#FFA500",
          borderRadius: "5px",
          padding: "10px 20px",
          color: "white",
          border: "none",
          cursor: "pointer",
          outline: "none",
          marginBottom: "10px",
          width: "100%"
        }}
      >
        Edit Polygon
      </button>
      {isEditing && (
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <button
            onClick={onSave}
            style={{
              backgroundColor: "#4CAF50",
              borderRadius: "5px",
              padding: "10px 20px",
              color: "white",
              border: "none",
              cursor: "pointer",
              outline: "none",
              flex: 1,
              marginRight: "5px"
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              onCancel();
            }}
            style={{
              backgroundColor: "#f44336",
              borderRadius: "5px",
              padding: "10px 20px",
              color: "white",
              border: "none",
              cursor: "pointer",
              outline: "none",
              flex: 1
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default EditControl;
