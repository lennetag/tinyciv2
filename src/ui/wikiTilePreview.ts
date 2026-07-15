import {
  AmbientLight,
  Color,
  DirectionalLight,
  OrthographicCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Group
} from "three";
import { getTileDefinition } from "../assets/terrainTiles";
import type { TileType } from "../game/types";
import { resizeIsometricCamera } from "../game/camera";

const PREVIEW_FRUSTUM = 4.8;

export class WikiTilePreview {
  readonly element: HTMLDivElement;

  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: WebGLRenderer;
  private readonly scene: Scene;
  private readonly camera: OrthographicCamera;
  private readonly size = new Vector2();
  private readonly resizeObserver?: ResizeObserver;
  private previewTile: Group | null = null;

  constructor() {
    this.element = document.createElement("div");
    this.element.className = "hud__wiki-preview";

    this.canvas = document.createElement("canvas");
    this.canvas.className = "hud__wiki-preview-canvas";
    this.element.append(this.canvas);

    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: this.canvas
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(new Color("#000000"), 0);

    this.scene = new Scene();
    this.camera = new OrthographicCamera(
      -PREVIEW_FRUSTUM / 2,
      PREVIEW_FRUSTUM / 2,
      PREVIEW_FRUSTUM / 2,
      -PREVIEW_FRUSTUM / 2,
      0.1,
      100
    );
    this.camera.position.set(4.8, 4.8, 4.8);
    this.camera.lookAt(new Vector3(0, 0.45, 0));

    const ambient = new AmbientLight("#ffffff", 2.6);
    const sun = new DirectionalLight("#fff6dc", 2.2);
    sun.position.set(8, 14, 10);
    this.scene.add(ambient, sun);

    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(() => this.render());
      this.resizeObserver.observe(this.element);
    }
  }

  setTile(tileType: TileType) {
    if (this.previewTile) {
      this.scene.remove(this.previewTile);
      this.previewTile = null;
    }

    this.previewTile = getTileDefinition(tileType).createTile();
    this.previewTile.position.y = 0.01;
    this.scene.add(this.previewTile);
    this.render();
  }

  dispose() {
    this.resizeObserver?.disconnect();
    this.renderer.dispose();
  }

  private render() {
    const width = Math.max(this.element.clientWidth, 1);
    const height = Math.max(this.element.clientHeight, 1);

    if (this.size.x !== width || this.size.y !== height) {
      this.size.set(width, height);
      resizeIsometricCamera(this.camera, PREVIEW_FRUSTUM, width / height);
      this.renderer.setSize(width, height, false);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
