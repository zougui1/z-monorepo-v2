import * as React from "react";
import { SVGProps } from "react";
const SvgFileTypeMarkdown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      d="M2.5 7.955h27v16.091h-27z"
      style={{
        fill: "none",
        stroke: "#755838",
      }}
    />
    <path
      d="M5.909 20.636v-9.272h2.727l2.728 3.409 2.727-3.409h2.727v9.272h-2.727v-5.318l-2.727 3.409-2.728-3.409v5.318H5.909zM22.955 20.636l-4.091-4.5h2.727v-4.772h2.727v4.772h2.727l-4.09 4.5z"
      style={{
        fill: "#755838",
      }}
    />
  </svg>
);
export default SvgFileTypeMarkdown;
