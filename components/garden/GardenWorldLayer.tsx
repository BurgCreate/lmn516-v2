export default function GardenWorldLayer() {
  return (
    <div className="garden-world" aria-hidden="true">
      <div className="garden-world-sun" />

      <svg
        className="garden-world-drawing"
        viewBox="0 0 1600 2400"
        preserveAspectRatio="xMidYMin slice"
        focusable="false"
      >
        <g className="garden-world-ink">
          <path d="M-30 180C145 126 282 154 405 252C510 336 600 348 704 300" />
          <path d="M32 168C74 130 114 112 158 106" />
          <path d="M92 145C69 112 59 79 64 48" />
          <path d="M94 145C126 119 151 91 167 56" />
          <path d="M188 145C164 110 159 75 171 42" />
          <path d="M190 145C224 122 251 91 267 54" />

          <path d="M1275 80C1380 152 1467 282 1625 330" />
          <path d="M1402 170C1432 137 1451 101 1458 63" />
          <path d="M1406 173C1376 141 1358 108 1354 74" />
          <path d="M1505 259C1542 226 1564 191 1573 151" />
          <path d="M1508 260C1475 232 1451 198 1438 158" />

          <path d="M-45 905C174 823 313 862 452 1008C555 1115 659 1146 813 1084" />
          <path d="M49 873C88 832 110 786 116 738" />
          <path d="M54 874C23 842 5 806 0 767" />
          <path d="M222 881C252 842 268 797 267 749" />
          <path d="M224 883C189 851 164 814 151 772" />

          <path d="M1240 1188C1360 1104 1497 1095 1645 1174" />
          <path d="M1360 1127C1337 1087 1332 1048 1343 1010" />
          <path d="M1360 1127C1395 1096 1420 1060 1433 1018" />
          <path d="M1501 1119C1474 1082 1463 1043 1468 1001" />
          <path d="M1502 1119C1538 1092 1564 1057 1579 1015" />

          <path d="M-15 1838C168 1766 331 1792 485 1912C603 2004 724 2024 860 1974" />
          <path d="M91 1802C70 1764 66 1727 77 1691" />
          <path d="M94 1803C127 1775 151 1740 164 1699" />
          <path d="M300 1816C270 1779 257 1739 260 1697" />
          <path d="M301 1816C338 1787 366 1751 383 1707" />

          <path d="M1190 2100C1340 2018 1499 2044 1640 2163" />
          <path d="M1327 2054C1302 2017 1295 1979 1304 1942" />
          <path d="M1329 2055C1364 2027 1388 1993 1401 1952" />
          <path d="M1511 2086C1485 2047 1477 2008 1486 1968" />
          <path d="M1511 2086C1546 2058 1570 2024 1584 1982" />
        </g>

        <g className="garden-world-grass">
          <path d="M0 2288C142 2256 294 2268 438 2298C590 2330 727 2320 876 2285C1043 2246 1212 2248 1380 2290C1466 2312 1538 2315 1600 2298" />
          <path d="M75 2294L52 2230M88 2291L94 2213M104 2292L134 2240M1320 2290L1300 2217M1338 2291L1352 2221M1361 2294L1395 2239" />
        </g>

        <g className="garden-world-daisy" transform="translate(210 520)">
          <path d="M0 165C6 110 8 60 5 15" />
          <path d="M2 106C-32 88-51 67-56 43" />
          <path d="M3 83C35 67 56 43 63 17" />
          <ellipse cx="5" cy="-2" rx="18" ry="36" transform="rotate(0 5 -2)" />
          <ellipse cx="5" cy="-2" rx="18" ry="36" transform="rotate(60 5 -2)" />
          <ellipse cx="5" cy="-2" rx="18" ry="36" transform="rotate(120 5 -2)" />
          <circle className="garden-world-gold" cx="5" cy="-2" r="12" />
        </g>

        <g className="garden-world-bells" transform="translate(1335 1460)">
          <path d="M0 190C-8 128 0 67 22 9" />
          <path d="M16 88C-28 72-54 44-63 4" />
          <path d="M12 117C51 101 78 74 92 36" />
          <path d="M-67 2C-52 -18-28-17-14 3C-18 28-31 43-44 50C-57 40-65 22-67 2Z" />
          <path d="M89 33C105 12 129 12 143 33C139 57 126 72 112 80C99 69 91 52 89 33Z" />
        </g>

        <g className="garden-world-butterfly" transform="translate(1120 620)">
          <path d="M0 8C-20-17-48-14-52 7C-55 27-32 37-4 21" />
          <path d="M0 8C20-17 48-14 52 7C55 27 32 37 4 21" />
          <path d="M0 9C-8 24-8 40 0 53C8 40 8 24 0 9Z" />
          <path d="M-2 7C-8-2-15-7-23-9M2 7C8-2 15-7 23-9" />
        </g>

        <g className="garden-world-butterfly garden-world-butterfly-small" transform="translate(430 1550)">
          <path d="M0 8C-20-17-48-14-52 7C-55 27-32 37-4 21" />
          <path d="M0 8C20-17 48-14 52 7C55 27 32 37 4 21" />
          <path d="M0 9C-8 24-8 40 0 53C8 40 8 24 0 9Z" />
        </g>
      </svg>

      <div className="garden-world-paper" />
      <div className="garden-world-wash garden-world-wash-a" />
      <div className="garden-world-wash garden-world-wash-b" />
    </div>
  );
}
