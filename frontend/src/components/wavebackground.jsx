import { useMemo } from "react";

import { motion } from "framer-motion";

export default function WaveBackground() {

  const particles = useMemo(

    () =>

      Array.from({ length: 22 }, (_, i) => ({

        id: i,

        size: 1.5 + Math.random() * 3.5,

        left: Math.random() * 100,

        delay: Math.random() * 10,

        duration: 16 + Math.random() * 14,

        drift: (Math.random() - 0.5) * 60,

      })),

    []

  );



  return (

    <div className="aura-bg" aria-hidden="true">

      <div className="aura-mesh" />

      <div className="aura-spotlight" />



      <svg

        className="aura-waves"

        viewBox="0 0 1440 420"

        preserveAspectRatio="none"

        xmlns="http://www.w3.org/2000/svg"

      >

        <path

          className="aura-wave aura-wave-1"

          d="M-200,220 C80,150 280,290 560,220 C840,150 1040,290 1320,220 C1500,180 1640,220 1840,220 L1840,420 L-200,420 Z"

        />

        <path

          className="aura-wave aura-wave-2"

          d="M-200,260 C120,200 320,320 600,260 C880,200 1080,320 1360,260 C1540,230 1660,260 1840,260 L1840,420 L-200,420 Z"

        />

        <path

          className="aura-wave aura-wave-3"

          d="M-200,300 C140,260 340,350 620,300 C900,260 1100,350 1380,300 C1560,280 1680,300 1840,300 L1840,420 L-200,420 Z"

        />

      </svg>



      <div className="aura-particles">

        {particles.map((p) => (

          <motion.span

            key={p.id}

            className="aura-particle"

            style={{ left: `${p.left}%`, width: p.size, height: p.size }}

            initial={{ y: "10vh", opacity: 0 }}

            animate={{

              y: ["10vh", "-110vh"],

              x: [0, p.drift],

              opacity: [0, 1, 1, 0],

            }}

            transition={{

              duration: p.duration,

              delay: p.delay,

              repeat: Infinity,

              ease: "linear",

            }}

          />

        ))}

      </div>

    </div>

  );

}  