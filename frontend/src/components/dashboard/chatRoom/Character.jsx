// src/components/Character.js
"use client";

import { useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { VISEMES } from "wawa-lipsync";
import { lipsyncManager } from "@/lib/wawa-lipsync/lipsyncManager";
import { selectAnimation, setAnimation } from "@/lib/features/chat/chat.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import { selectPreferences } from "@/lib/features/preferences/preferences.slice";
import { AssetRegistry } from "@/lib/three/assetRegistry";

// let setupMode = false;
// let currentViseme = "viseme_nn";
// let listeningTimeout = null;
// let timeoutActive = false;
// let previousAnimation = "standing";

function Character({ gltf, vadRef, ...props }) {
  if (!gltf || !gltf.nodes) {
    return null;
  }

  const { nodes, materials, scene } = gltf;
  const animation = useAppSelector(selectAnimation);
  const preferences = useAppSelector(selectPreferences);
  const speechSpeed = preferences?.speechSpeed ?? 0;
  const dispatch = useAppDispatch();
  const group = useRef();
  const breathingPhase = useRef(0);
  const [blink, setBlink] = useState(false);

  const listeningTimeout = useRef(null);
  const timeoutActive = useRef(false);
  const previousAnimation = useRef("standing");

  const clips = useMemo(
    () => Object.values(AssetRegistry.animations || {}),
    [AssetRegistry.animations]
  );
  const { actions, mixer } = useAnimations(clips, group);

  useEffect(() => {
    const action = actions[animation];
    if (!action || !mixer) return;

    // Handler for when talking action finishes
    const onFinished = () => {
      if (animation === "talking") {
        if (action.isRunning) action.fadeOut(0.7);
        actions["idle"]
          .reset()
          .setLoop(THREE.LoopRepeat, Infinity)
          .fadeIn(0.5)
          .play();
        dispatch(setAnimation("idle"));
      }
    };

    mixer.addEventListener("finished", onFinished);

    if (animation === "talking") {
      action.reset();
      action.setLoop(THREE.LoopOnce);
      action.fadeIn(0.3);
      action.play();
      action.clampWhenFinished = true;
      // action.enabled = true;
    } else {
      action.reset();
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.fadeIn(
        previousAnimation.current === "standing" && animation === "idle"
          ? 1
          : 0.5
      );
      action.play();
    }
    previousAnimation.current = animation;
    return () => {
      mixer.removeEventListener("finished", onFinished);
      if (action.isRunning() && animation !== "talking") {
        action.fadeOut(0.5);
      }
    };
  }, [animation, actions]);

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (!child.isSkinnedMesh || !child.morphTargetDictionary) return;
      const index = child.morphTargetDictionary[target];
      if (index === undefined) return;
      child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
        child.morphTargetInfluences[index],
        value,
        speed
      );
    });
  };

  useFrame((_, delta) => {
    lerpMorphTarget("eyeBlinkLeft", blink ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink ? 1 : 0, 0.5);

    // if (setupMode.current) return;

    lipsyncManager.processAudio();

    let viseme = lipsyncManager.viseme;
    let state = lipsyncManager.state;

    // if (
    //   !vadRef.current?.userSpeaking &&
    //   listeningTimeout.current !== null &&
    //   !timeoutActive.current
    // ) {
    //   timeoutActive.current = true;
    //   setTimeout(() => {
    //     listeningTimeout.current = null;
    //     timeoutActive.current = false;
    //   }, 800);
    // } else if (
    //   vadRef.current?.userSpeaking &&
    //   !vadRef.current?.paused &&
    //   vadRef.current?.listening &&
    //   listeningTimeout.current === null
    // ) {
    //   listeningTimeout.current = true;
    // }

    const smileWeight = vadRef.current.userSpeaking ? 0.3 : 0;
    lerpMorphTarget("mouthSmileLeft", smileWeight, 0.1);
    lerpMorphTarget("mouthSmileRight", smileWeight, 0.1);
    lerpMorphTarget(viseme, 1, state === "vowel" ? 0.2 : 0.4);

    Object.values(VISEMES).forEach((v) => {
      if (v !== viseme) lerpMorphTarget(v, 0, state === "vowel" ? 0.1 : 0.2);
    });

    if (listeningTimeout.current !== null) {
      breathingPhase.current += delta * -6;
      if (nodes.Head)
        nodes.Head.rotation.x = Math.sin(breathingPhase.current) * 0.05 - 0.2;
    }
  });

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  return (
    <group {...props} ref={group} dispose={null}>
      {nodes.Hips && <primitive object={nodes.Hips} />}
      {Object.values(nodes).map((node) => {
        if (!node.isSkinnedMesh) return null;
        return (
          <skinnedMesh
            key={node.uuid}
            geometry={node.geometry}
            material={materials[node.material.name] || node.material}
            skeleton={node.skeleton}
            morphTargetDictionary={node.morphTargetDictionary}
            morphTargetInfluences={node.morphTargetInfluences}
          />
        );
      })}
    </group>
  );
}

export default Character;
