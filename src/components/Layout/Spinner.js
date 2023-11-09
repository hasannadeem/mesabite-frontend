import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

const override = {
  marginTop: "100%",
};

const Spinner = () => {
  return (
    <div className="spinner d-flex justify-content-center">
      <BeatLoader
        color="#fff"
        cssOverride={override}
        loading={true}
        size={15}
        aria-label="Loading Spinner"
      />
    </div>
  );
};

export default Spinner;
