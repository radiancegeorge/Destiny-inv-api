import React, { useEffect } from "react";
import copy from "copy-text-to-clipboard";

const Btn = ({ record, property, ...props }) => {
  const value = React.useMemo(() => record.params[property.path]);
  const [isCopied, setIsCopied] = React.useState(false);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied((state) => !state);
      }, 2000);
    }
  }, [isCopied]);
  return (
    <div>
      <p>
        {value}
        <span
          style={{
            transition: "0.5s",
            padding: "5px 10px",
            borderRadius: 5,
            backgroundColor: "green",
            color: "white",
            marginLeft: "10px",
            cursor: "pointer",
          }}
          onClick={async () => {
            copy(value);
            setIsCopied(true);
          }}>
          {isCopied ? "copied" : "copy"}
        </span>
      </p>
    </div>
  );
};

export default Btn;
