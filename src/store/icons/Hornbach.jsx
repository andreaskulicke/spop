import * as React from "react"
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={183.77}
    height={183.77}
    viewBox="919 0 183.77 183.77"
    {...props}
  >
    <Defs>
      <ClipPath id="a" clipPathUnits="userSpaceOnUse">
        <Path d="M4645.49 1409.03h816.73V591.922h-816.73v817.108z" />
      </ClipPath>
    </Defs>
    <Path
      d="M4645.49 591.922h816.734v817.109H4645.49V591.922z"
      style={{
        fill: "#c40070",
        stroke: "none",
      }}
      transform="matrix(.2 0 0 -.2 -.623 292.036)"
    />
    <G
      clipPath="url(#a)"
      style={{
        fill: "#f7911a",
        stroke: "none",
      }}
      transform="matrix(.2 0 0 -.2 -.623 292.036)"
    >
      <Path d="m4516.08 519.168 1004.1 1004.092 56.01-55.96-1004.1-1004.093-56.01 55.961M4432.13 603.031l1004.1 1004.099 56.02-55.97-1004.1-1004.094-56.02 55.965M4348.2 686.891 5352.29 1690.99l56.01-55.97L4404.21 630.93l-56.01 55.961M4264.25 770.754l1004.1 1004.096 56.01-55.96L4320.27 714.793l-56.02 55.961M6204.78 29.855 5199.72 1033.95l56.02 56.03L6260.79 85.879l-56.01-56.024M6120.84-54.094 5115.78 950l56.02 56.02L6176.85 1.926l-56.01-56.02M6036.89-138.047 5031.84 866.051l56.01 56.023L6092.91-82.027l-56.02-56.02M5952.95-222 4947.89 782.098l56.02 56.023L6008.96-165.977 5952.95-222" />
    </G>
  </Svg>
)
export default SvgComponent
