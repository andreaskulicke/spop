import * as React from "react";
import Svg, { Path } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: title */
const SvgComponent = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
        <Path
            fill="currentColor"
            d="m18.36 9 .6 3H5.04l.6-3h12.72M20 4H4v2h16V4m0 3H4l-1 5v2h1v6h10v-6h4v6h2v-6h1v-2l-1-5M6 18v-4h6v4H6Z"
        />
    </Svg>
);
export default SvgComponent;
