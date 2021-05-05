import React from "react";
import { array } from "prop-types";
import { Image } from "react-bootstrap";
import { MedalObtained } from "./";

export const MedalTable = ({ rewards }) => {
  return (
    <div className="text-center">
      {rewards.map((r) =>
        r.hasReward ? (
          <MedalObtained key={r.medalName} reward={r} />
        ) : (
          <Image
            className="my-1 mx-3"
            height="120"
            key={r.medalName}
            src="/images/emptyMedal.png"
            style={{ opacity: 0.3 }}
            width="80"
          />
        )
      )}
    </div>
  );
};

MedalTable.propTypes = {
  rewards: array.isRequired,
};
