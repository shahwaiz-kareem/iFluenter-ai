import { useCallback } from "react";
import { get, set } from "idb-keyval";
import { useAppDispatch } from "@/lib/hooks/hooks";
import {
  setAnimation,
  setAssetsStatus,
  setIsModalOpen,
} from "@/lib/features/chat/chat.slice";
import { parseHDR, parseGLTF, parseFBX } from "@/lib/three/parsers";
import { AssetRegistry } from "@/lib/three/assetRegistry";

export const useGetAssets = (vadRef) => {
  const dispatch = useAppDispatch();

  const waitForVAD = async () => {
    return new Promise((resolve, reject) => {
      const checkStatus = () => {
        if (vadRef.current.errored) {
          reject(new Error("VAD failed to load"));
        } else if (!vadRef.current.loading) {
          resolve();
        } else {
          setTimeout(checkStatus, 500);
        }
      };
      checkStatus();
    });
  };

  const fetchBinary = async (key, url) => {
    try {
      const cached = await get(key);
      if (cached instanceof ArrayBuffer && cached.byteLength > 500)
        return cached;

      const res = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          Referer: "https://ifluenter.com",
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);

      const buffer = await res.arrayBuffer();

      if (buffer.byteLength < 500)
        throw new Error(`Invalid payload from ${url}`);

      await set(key, buffer);
      return buffer;
    } catch (err) {
      throw err;
    }
  };

  const getAssets = useCallback(
    async ({
      avatarId,
      avatarUrl,
      envId,
      envUrl,
      animationsArr,
      avatarChanged,
      envChanged,
    }) => {
      try {
        if (!avatarId || !avatarUrl || !envId || !envUrl || !animationsArr) {
          // console.log(
          //   "aId:",
          //   avatarId,
          //   "aUrl:",
          //   avatarUrl,
          //   "eId:",
          //   envId,
          //   "eUrl:",
          //   envUrl,
          //   "animationArr:",
          //   animationsArr
          // );
          throw new Error("Missing required asset parameters");
        }
        if (vadRef.current.loading) {
          dispatch(
            setAssetsStatus({
              status: "loading",
              text: "Downloading voice detection models (~4MB)...",
              value: 5,
            })
          );
          await waitForVAD();
        }

        if (!AssetRegistry.envTexture || envChanged) {
          dispatch(
            setAssetsStatus({
              status: "loading",
              value: 20,
              text: `Getting Environment (~1.5MB)`,
            })
          );
          const envBuffer = await fetchBinary(`env:${envId}`, envUrl);
          const envTexture = await parseHDR(envBuffer);
          AssetRegistry.envTexture = envTexture;
        }
        dispatch(
          setAssetsStatus({
            status: "loading",
            value: 30,
          })
        );

        // load Avatar
        // console.log(!AssetRegistry.avatarGLTF, AssetRegistry.avatarGLTF);
        if (!AssetRegistry.avatarGLTF || avatarChanged) {
          const avatarBuffer = await fetchBinary(
            `avatar:${avatarId}`,
            avatarUrl
          );
          dispatch(
            setAssetsStatus({
              status: "loading",
              value: 40,
              text: `Getting Avatar (~1.5MB)`,
            })
          );
          const gltf = await parseGLTF(avatarBuffer);
          AssetRegistry.avatarGLTF = gltf;
        }
        dispatch(
          setAssetsStatus({
            status: "loading",
            value: 50,
          })
        );

        const animPromises = animationsArr.map(async (name, i) => {
          try {
            // console.log(AssetRegistry.animations);
            if (AssetRegistry.animations[name]) return;
            const animUrl =
              typeof window !== "undefined" &&
              window.location.hostname !== "localhost"
                ? `https://cdn.ifluenter.com/animations/${name}.fbx`
                : `${process.env.NEXT_PUBLIC_BACKEND_HOST}/assets/animations/${name}.fbx`;
            const buffer = await fetchBinary(`anim:${name}`, animUrl);

            const fbx = await parseFBX(buffer);

            if (fbx.animations?.length) {
              const clip = fbx.animations[0];
              clip.name = name;
              AssetRegistry.animations[name] = clip;
            } else {
              console.warn(
                `[getAssets] No animations found in FBX for ${name}`
              );
            }

            const progress =
              60 + Math.round(((i + 1) / animationsArr.length) * 30);
            dispatch(
              setAssetsStatus({
                status: "loading",
                value: progress,
                text: `Getting ${name} animation (~1MB)`,
              })
            );

            return { name, success: true };
          } catch (err) {
            console.error(`[getAssets] FBX parse failed for ${name}:`, err);
            return { name, success: false, error: err.message };
          }
        });

        await Promise.all(animPromises);
        dispatch(setAnimation("standing"));

        // Small delay to ensure everything is settled
        await new Promise((resolve) => setTimeout(resolve, 100));
        dispatch(
          setAssetsStatus({
            status: "loading",
            value: 100,
            text: "Loading Done",
          })
        );
        dispatch(setIsModalOpen(false));
        setTimeout(
          () =>
            dispatch(
              setAssetsStatus({
                status: "",
                value: 100,
                text: "Loading Done",
              })
            ),
          300
        );

        return { success: true };
      } catch (err) {
        dispatch(
          setAssetsStatus({
            status: "error",
            value: 0,
            msg: err.message || "Failed to load assets",
          })
        );
        throw err;
      }
    },
    [dispatch]
  );

  return { getAssets };
};

export default useGetAssets;
