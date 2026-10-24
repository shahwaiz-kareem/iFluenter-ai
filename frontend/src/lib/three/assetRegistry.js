export const AssetRegistry = {
  envTexture: null,
  avatarGLTF: null,
  animations: {},

  clear() {
    this.envTexture?.dispose?.();
    this.envTexture = null;
    this.avatarGLTF = null;
    this.animations = {};
  },
};
