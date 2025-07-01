import React from 'react'
import Svg, { Path } from "react-native-svg";

export default function Svgdata({ icon, className, color, size }) {
    const icons = {
        leaf: (
            <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                className={className}
                data-src="https://cdn.hugeicons.com/icons/plant-01-stroke-standard.svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                role="img"
                color="#4A5568"
            >
                <Path
                    d="M9.34882 11.1825C7.73784 12.3891 5.44323 12.26 3.9785 10.7953C1.55484 8.37164 2.03957 3.03957 2.03957 3.03957C2.03957 3.03957 7.37164 2.55484 9.7953 4.9785C10.7548 5.93803 11.1412 7.25369 10.9543 8.5"
                    stroke="#4A5568"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="M14.9638 12.8175C13.644 11.3832 13.6797 9.14983 15.0708 7.75867C17.2252 5.6043 21.9648 6.03517 21.9648 6.03517C21.9648 6.03517 22.3957 10.7748 20.2413 12.9292C19.4877 13.6828 18.487 14.0386 17.5 13.9967"
                    stroke="#4A5568"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="M18 10C18 10 12 14 12 21C12 12 6 7 6 7"
                    stroke="#4A5568"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        ),
        home: (
            <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                className={className}
                data-src="https://cdn.hugeicons.com/icons/home-01-stroke-standard.svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                role="img"
                color="#4A5568"
            >
                <Path
                    d="M3.5 12.5L12 4L20.5 12.5V19C20.5 19.5523 20.0523 20 19.5 20H4.5C3.94772 20 3.5 19.5523 3.5 19V12.5Z"
                    stroke="#4A5568"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="M9 21V14C9 13.4477 9.44772 13 10 13H14C14.5523 13 15 13.4477 15 14V21"
                    stroke="#4A5568"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        )

    };

    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            role="img"
        >
            {icons[icon]}
        </Svg>
    );
}
