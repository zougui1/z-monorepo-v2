import * as React from "react";
import { SVGProps } from "react";
const SvgDefaultFile = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      d="M20.414 2H5v28h22V8.586ZM7 28V4h12v6h6v18Z"
      style={{
        fill: "#c5c5c5",
      }}
    />
  </svg>
);
export default SvgDefaultFile;
