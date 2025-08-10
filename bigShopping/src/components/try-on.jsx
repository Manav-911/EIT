import React from "react";

function TryOn({ onTryOn}) {
  return (
    <div className='try-on'>
      <button onClick={onTryOn}>
        Try on
      </button>
    </div>
  );
}

export { TryOn };