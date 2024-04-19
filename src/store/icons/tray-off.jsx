import * as React from "react"
import Svg, { Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      d="m3.36 5.254-1.41 1.41 3.55 3.55 12.68 12.68 1.41-1.41z"
      style={{
        display: "inline",
      }}
    />
    <Path
      d="M2 12v5a2 2 0 0 0 2 2h13.125l-1.986-1.977A.054.054 0 0 1 15.11 17H4v-5zm18 0v5h-3.219a.049.049 0 0 1-.01.023L18.934 19H20a2 2 0 0 0 2-2v-5z"
      style={{
        display: "inline",
      }}
    />
  </Svg>
)
export default SvgComponent
