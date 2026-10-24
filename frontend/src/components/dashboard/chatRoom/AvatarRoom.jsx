"use client";

import { Suspense } from "react";
import { Environment } from "@react-three/drei";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectAssetsKeys } from "@/lib/features/chat/chat.slice";
import Character from "./Character";
import { AssetRegistry } from "@/lib/three/assetRegistry";

export default function AvatarRoom({ sizes, vadRef }) {
  const assetsKeys = useAppSelector(selectAssetsKeys);
  const envTexture = AssetRegistry.envTexture;
  const avatarGLTF = AssetRegistry.avatarGLTF;

  const canRenderCharacter = !!(
    assetsKeys.avatar &&
    assetsKeys.env &&
    avatarGLTF
  );

  return (
    <>
      {envTexture && (
        <Environment
          map={envTexture}
          background
          resolution={2048}
          key={assetsKeys.env}
        />
      )}

      <Suspense fallback={null}>
        {canRenderCharacter && (
          <Character
            key={assetsKeys.avatar}
            gltf={avatarGLTF}
            vadRef={vadRef}
            scale={sizes.AvatarScale}
            position={sizes.AvatarPosition}
          />
        )}
      </Suspense>
    </>
  );
}
