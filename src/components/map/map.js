import React, { useEffect } from "react";

function GoogleMap({ lat, long }) {
  useEffect(() => {
    const ifameData = document.getElementById("iframeId");

    ifameData.src = `https://maps.google.com/maps?q=${lat},${long}&hl=es;&output=embed`;
  }, [lat, long]);
  return (
    <div>
      <iframe id="iframeId" height="500px" width="100%"></iframe>
    </div>
  );
}
export default GoogleMap;
