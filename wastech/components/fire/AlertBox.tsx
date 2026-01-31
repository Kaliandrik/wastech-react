import React from "react";

interface AlertBoxProps {
  distance: number;
}

const AlertBox: React.FC<AlertBoxProps> = ({ distance }) => {
  return (
    <div className="bg-red-600 text-white p-4 rounded-lg mt-3 text-center font-bold">
      🔥 Atenção! Incêndio detectado a menos de {distance} km de você.
    </div>
  );
};

export default AlertBox;