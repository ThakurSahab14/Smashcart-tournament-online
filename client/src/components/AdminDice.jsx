
import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import DiceScene from "./three/DiceScene.jsx";

import img1 from "../assets/dice/1.png";
import img2 from "../assets/dice/2.png";
import img3 from "../assets/dice/3.png";
import img4 from "../assets/dice/4.jpg";
import img5 from "../assets/dice/5.png";
import img6 from "../assets/dice/6.png";

const rewards=[img1,img2,img3,img4,img5,img6];

function RewardPopup({image,onClose}){
  useEffect(()=>{
    const t=setTimeout(onClose,2000);
    return ()=>clearTimeout(t);
  },[onClose]);

  return(
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 backdrop-blur-md"
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
    >
      <motion.img
        src={image}
        className="w-[70vw] max-w-[700px] rounded-3xl shadow-2xl"
        initial={{scale:0.2,rotate:-180,opacity:0}}
        animate={{scale:1.15,rotate:360,opacity:1}}
        exit={{scale:0.2,rotate:540,opacity:0}}
        transition={{duration:1.2,ease:"easeOut"}}
      />
    </motion.div>
  )
}

export default function AdminDice(){
  const [hovered,setHovered]=useState(false);
  const [reward,setReward]=useState(null);

  const reveal=()=>{
    const img=rewards[Math.floor(Math.random()*rewards.length)];
    setReward(img);
  }

  return(
    <>
    <div
      onPointerEnter={()=>setHovered(true)}
      onPointerLeave={()=>setHovered(false)}
      className="relative h-56 overflow-hidden rounded-2xl border border-white/10 sm:h-64"
    >
      <Canvas camera={{position:[0,0.6,5],fov:45}} dpr={[1,1.5]}>
        <DiceScene hovered={hovered} onReveal={reveal}/>
      </Canvas>

      <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[11px] uppercase tracking-widest text-white/40">
        You're admin you can do whatever you want! I am your's baby!💋
      </div>
    </div>

    <AnimatePresence>
      {reward && <RewardPopup image={reward} onClose={()=>setReward(null)}/>}
    </AnimatePresence>
    </>
  )
}
