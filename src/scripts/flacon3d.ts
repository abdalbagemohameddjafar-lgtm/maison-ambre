// Flacon de parfum en 3D (Three.js), construit entièrement en code — aucun modèle externe.
// Chargé à la demande depuis la bannière d'accueil (import dynamique), voir index.astro.
//
// Proportions reprises du flacon CSS (taille « grand ») : 1 unité = 100 px.
//   bouchon 61 × 54 · col 36 × 18 · corps 173 × 198 (coins arrondis 18)
//
// Deux idées clés :
// 1. Verre réaliste = transmission physique (réfraction). Comme le moteur 3D ne « voit » pas la page
//    HTML derrière le canvas, la scène redessine elle-même le fond de la bannière (même dégradé,
//    même halo, au pixel près) : le verre réfracte donc le vrai décor.
// 2. Liquide vivant = la surface du parfum est calculée dans le shader (coupe horizontale + pente
//    + petites vagues). Un ressort amorti fait pencher et onduler la surface quand le flacon
//    accélère ou freine, puis tout se calme.

import {
  NeutralToneMapping,
  CanvasTexture,
  Clock,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { BoxGeometry } from 'three';

type Options = {
  couleur?: string; // teinte du liquide
  calme?: boolean; // prefers-reduced-motion : pas de rotation auto ni de flottement
  fond?: HTMLElement; // l'élément dont on reproduit le fond (la bannière)
};

const TOUR = (Math.PI * 2) / 12; // 1 tour en 12 s

/** Étiquette « MA » dessinée dans un canvas (italique, filet blanc), comme sur le flacon CSS. */
function texteEtiquette(): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const g = c.getContext('2d')!;
  g.strokeStyle = 'rgba(255,255,255,0.9)';
  g.lineWidth = 7;
  g.strokeRect(40, 40, 432, 176);
  g.fillStyle = 'rgba(255,255,255,0.96)';
  g.font = 'italic 400 150px "Cormorant Garamond", Georgia, serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('MA', 256, 140);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Studio photo virtuel : une pièce tiède et sombre avec des bandes lumineuses (« softbox »).
 *  Ce sont ces bandes qui se reflètent dans le verre en traits nets, comme sur une photo de parfum. */
function studio(): Scene {
  const s = new Scene();
  s.background = new Color('#6e5c4c'); // pièce tiède : le métal doré reste lumineux
  const lumiere = (couleur: string, intensite: number) =>
    new MeshBasicMaterial({ color: new Color(couleur).multiplyScalar(intensite) });
  const bande = (l: number, h: number, x: number, y: number, z: number, ry: number, mat: MeshBasicMaterial) => {
    const m = new Mesh(new BoxGeometry(l, h, 0.1), mat);
    m.position.set(x, y, z);
    m.rotation.y = ry;
    s.add(m);
  };
  // deux grandes bandes verticales, à gauche et à droite, légèrement en avant
  bande(1.2, 9, -4.5, 0.5, 2.5, Math.PI / 3, lumiere('#fff4e6', 6));
  bande(0.8, 9, 4.8, 0.5, 1.5, -Math.PI / 3, lumiere('#ffe3c2', 4));
  // une boîte à lumière au-dessus, et un rappel chaud derrière
  const dessus = new Mesh(new BoxGeometry(5, 0.1, 3), lumiere('#fff8ef', 3));
  dessus.position.set(0, 5, 0);
  s.add(dessus);
  bande(6, 3, 0, 1, -6, 0, lumiere('#e8b977', 1.2));
  // sol clair (rebond doux par en dessous)
  const sol = new Mesh(new BoxGeometry(20, 0.1, 20), lumiere('#cbb79c', 0.6));
  sol.position.y = -4;
  s.add(sol);
  return s;
}

/** Ombre de contact : dégradé radial très doux sous le flacon. */
function texteOmbre(): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const d = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  d.addColorStop(0, 'rgba(70,40,12,0.42)');
  d.addColorStop(0.45, 'rgba(70,40,12,0.14)');
  d.addColorStop(1, 'rgba(70,40,12,0)');
  g.fillStyle = d;
  g.fillRect(0, 0, 256, 256);
  return new CanvasTexture(c);
}

/** Fond de la bannière recalculé dans les shaders (le fond lui-même ET le liquide, qui le réfracte) :
 *  linear-gradient(160deg, crème 40 %, sable) + halo radial(rgba(200,135,58,.35) → transparent 70 %).
 *  Les couleurs sont passées en valeurs sRGB BRUTES (Vector3) : un objet Color de Three.js les
 *  convertirait en linéaire, ce qui assombrissait le fond et faisait apparaître un « carré ». */
const srgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

function creerUniformsFond() {
  return {
    uDecalage: { value: new Vector2() }, // position du canvas dans la bannière (px CSS)
    uTailleFond: { value: new Vector2(1, 1) }, // taille de la bannière (px CSS)
    uCentreHalo: { value: new Vector2() }, // centre du halo dans la bannière (px CSS)
    uHauteurTampon: { value: 1 }, // hauteur du canvas en pixels réels
    uRatio: { value: 1 }, // devicePixelRatio utilisé
    uCreme: { value: srgb('#faf6f0') },
    uSable: { value: srgb('#efe6d8') },
    uHalo: { value: srgb('#c8873a') },
  };
}

const FOND_GLSL = /* glsl */ `
  uniform vec2 uDecalage, uTailleFond, uCentreHalo;
  uniform float uHauteurTampon, uRatio;
  uniform vec3 uCreme, uSable, uHalo;
  vec3 couleurFond(vec2 fragCoord) {
    // pixel du canvas → coordonnées CSS dans la bannière (y vers le bas)
    vec2 p = vec2(fragCoord.x, uHauteurTampon - fragCoord.y) / uRatio + uDecalage;
    // dégradé CSS à 160° : direction (sin160°, -cos160°) dans un repère y vers le bas
    vec2 dir = vec2(0.34202, 0.93969);
    float longueur = abs(uTailleFond.x * dir.x) + abs(uTailleFond.y * dir.y);
    float t = dot(p - uTailleFond * 0.5, dir) / longueur + 0.5;
    vec3 c = mix(uCreme, uSable, clamp((t - 0.4) / 0.6, 0.0, 1.0));
    // halo : 35 % au centre, transparent à 70 % du rayon de 170 px (119 px)
    float a = 0.35 * clamp(1.0 - length(p - uCentreHalo) / 119.0, 0.0, 1.0);
    return mix(c, uHalo, a);
  }
`;

function materiauFond(uniforms: ReturnType<typeof creerUniformsFond>) {
  return new ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    uniforms,
    vertexShader: /* glsl */ `
      void main() { gl_Position = vec4(position.xy, 0.9999, 1.0); }
    `,
    fragmentShader: FOND_GLSL + /* glsl */ `
      void main() { gl_FragColor = vec4(couleurFond(gl_FragCoord.xy), 1.0); }
    `,
  });
}

export async function monterFlacon(conteneur: HTMLElement, options: Options = {}) {
  const { couleur = '#b06c26', calme = false, fond = conteneur } = options;

  try {
    await document.fonts.load('italic 400 150px "Cormorant Garamond"');
  } catch {
    /* Georgia italique prend le relais */
  }

  // ---------- Rendu ----------
  const ratio = Math.min(window.devicePixelRatio, 2);
  const renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(ratio);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping; // garde les couleurs fidèles (pas de gris)
  renderer.toneMappingExposure = 1;
  renderer.setClearColor('#faf6f0');
  const canvas = renderer.domElement;
  canvas.className = 'flacon3d__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  conteneur.append(canvas);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(studio(), 0.02).texture;
  pmrem.dispose();

  const camera = new PerspectiveCamera(26, 1, 0.1, 50);
  const posCamera = new Vector3(0, 1.15, 9.6);
  camera.position.copy(posCamera);
  camera.lookAt(0, 0.25, 0);

  // Fond identique à la bannière (le verre le réfracte)
  const uniformsFond = creerUniformsFond();
  const materiauDuFond = materiauFond(uniformsFond);
  const fondPlan = new Mesh(new PlaneGeometry(2, 2), materiauDuFond);
  fondPlan.frustumCulled = false;
  fondPlan.renderOrder = -10;
  scene.add(fondPlan);

  // Lumières : environnement doux + une lumière chaude + un contre-jour pour dessiner les arêtes
  const soleil = new DirectionalLight('#ffd6a0', 2.4);
  soleil.position.set(3, 4, 4);
  scene.add(soleil);
  const contre = new DirectionalLight('#fff2df', 1.4);
  contre.position.set(-3, 3, -4);
  scene.add(contre);

  // ---------- Le flacon ----------
  const flacon = new Group();
  scene.add(flacon);

  const L = 1.73, H = 1.98, P = 0.9, R = 0.18;
  const paroi = 0.075; // épaisseur des parois
  const fondEpais = 0.24; // fond de flacon épais, comme un vrai flacon de parfum

  // Verre : transmission physique (réfraction du décor), indice 1,5, très lisse
  const verre = new MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0,
    roughness: 0.02,
    transmission: 1,
    thickness: 0.9,
    ior: 1.5,
    dispersion: 0.35, // léger arc-en-ciel sur les arêtes
    specularIntensity: 1,
    specularColor: '#ffffff',
    attenuationColor: '#efe2cf',
    attenuationDistance: 2.2, // les parties épaisses (fond, arêtes) prennent une teinte légèrement plus dense
    envMapIntensity: 1.1, // reflets nets des bandes lumineuses
  });
  const corps = new Mesh(new RoundedBoxGeometry(L, H, P, 8, R), verre);
  flacon.add(corps);

  // Liquide : volume intérieur, coupé dans le shader au niveau de la surface
  const hInterieur = H - paroi - fondEpais;
  const liquideGeo = new RoundedBoxGeometry(L - 2 * paroi, hInterieur, P - 2 * paroi, 6, R - paroi);
  // Couleur du parfum → « transmittance » : la part de lumière qui traverse une unité d'épaisseur.
  // Plus le trajet dans le liquide est long (bords, vue rasante), plus l'ambre est dense.
  const teinte = srgb(couleur);
  const transmittance = new Vector3(
    0.55 + teinte.x * 0.45,
    0.3 + teinte.y * 0.62,
    0.08 + teinte.z * 0.9,
  );
  const uniformsLiquide = {
    ...uniformsFond, // le liquide réfracte le même fond que le verre
    uCentre: { value: new Vector3() },
    uNiveau: { value: 0 }, // hauteur de la surface au repos (repère du flacon)
    uPente: { value: new Vector2() }, // pente de la surface (x, z) : le balancement
    uVague: { value: 0 }, // amplitude des vaguelettes
    uTemps: { value: 0 },
    uBas: { value: 0 }, // fond intérieur du flacon (repère du flacon)
    uTransmittance: { value: transmittance },
    uLueur: { value: new Vector3(1.0, 0.72, 0.32) }, // lumière chaude diffusée dans le liquide
  };
  const liquideMat = new MeshPhysicalMaterial({
    color: couleur,
    roughness: 0.03,
    metalness: 0,
    envMapIntensity: 1,
    side: DoubleSide,
  });
  liquideMat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniformsLiquide);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vPosMonde;')
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvPosMonde = (modelMatrix * vec4(transformed, 1.0)).xyz;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        ${FOND_GLSL}
        varying vec3 vPosMonde;
        uniform vec3 uCentre, uTransmittance, uLueur;
        uniform float uNiveau, uVague, uTemps, uBas;
        uniform vec2 uPente;
        // Surface du liquide : pente (balancement) + trois trains de vagues qui se croisent.
        // Renvoie (hauteur, dh/dx, dh/dz) pour calculer la normale de la surface.
        vec3 surface(vec3 p) {
          vec2 d = p.xz - uCentre.xz;
          vec2 k1 = vec2(7.0, 1.5), k2 = vec2(-2.0, 8.0), k3 = vec2(4.5, -5.5);
          float a1 = dot(d, k1) + uTemps * 5.0, a2 = dot(d, k2) - uTemps * 4.3, a3 = dot(d, k3) + uTemps * 6.1;
          float h = uVague * (0.5 * sin(a1) + 0.35 * sin(a2) + 0.15 * sin(a3));
          vec2 g = uVague * (0.5 * cos(a1) * k1 + 0.35 * cos(a2) * k2 + 0.15 * cos(a3) * k3);
          return vec3(uCentre.y + uNiveau + dot(d, uPente) + h, uPente + g);
        }`,
      )
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
        vec3 surf = surface(vPosMonde);
        float ecart = surf.x - vPosMonde.y;
        if (ecart < 0.0) discard;`,
      )
      .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
        vec3 V = normalize(vViewPosition);
        float hauteur = smoothstep(uCentre.y + uNiveau - 1.3, uCentre.y + uNiveau, vPosMonde.y);
        vec3 c;
        if (gl_FrontFacing) {
          // --- Paroi du liquide vue à travers le verre ---
          vec3 N = normalize(normal);
          float NdV = clamp(dot(N, V), 0.0, 1.0);
          float epais = 1.75 / max(NdV, 0.3); // trajet dans le liquide (plus long sur les bords)
          vec3 r = refract(-V, N, 1.0 / 1.33); // indice de réfraction d'un parfum (~ alcool)
          vec2 dec = (r.xy + V.xy) * 70.0 * uRatio; // le décor derrière est déformé
          vec3 trans = pow(uTransmittance, vec3(epais));
          c = couleurFond(gl_FragCoord.xy + dec) * trans; // absorption (loi de Beer-Lambert)
          c += uLueur * (1.0 - trans.b) * 0.16 * (0.4 + 0.6 * hauteur); // lueur chaude interne
          // caustique : la lumière qui traverse le liquide se concentre au fond du flacon
          float auFond = smoothstep(0.32, 0.0, vPosMonde.y - (uCentre.y + uBas));
          c += uLueur * auFond * 0.32 * (0.6 + 0.4 * sin(vPosMonde.x * 9.0 + uTemps * 1.3));
          float F = 0.02 + 0.98 * pow(1.0 - NdV, 5.0);
          #ifdef USE_ENVMAP
            vec3 reflet = getIBLRadiance(V, N, 0.02);
            c += pow(max(reflet, 0.0), vec3(1.0 / 2.2)) * F * 0.85;
          #endif
          // ménisque : fine ligne lumineuse là où le liquide touche le verre
          c += vec3(1.0, 0.86, 0.6) * smoothstep(0.03, 0.0, ecart) * 0.35;
        } else {
          // --- Surface du liquide (vue par en dessus, à travers le liquide) ---
          vec3 nMonde = normalize(vec3(-surf.y, 1.0, -surf.z));
          vec3 N = normalize((viewMatrix * vec4(nMonde, 0.0)).xyz);
          float NdV = clamp(abs(dot(N, V)), 0.0, 1.0);
          vec3 r = refract(-V, N, 1.0 / 1.33);
          vec2 dec = (r.xy + V.xy) * 90.0 * uRatio;
          vec3 dessous = couleurFond(gl_FragCoord.xy + dec) * pow(uTransmittance, vec3(3.0));
          float F = 0.02 + 0.98 * pow(1.0 - NdV, 5.0);
          vec3 reflet = vec3(1.0, 0.95, 0.88);
          #ifdef USE_ENVMAP
            reflet = pow(max(getIBLRadiance(V, N, 0.01), 0.0), vec3(1.0 / 2.2));
          #endif
          c = mix(dessous + uLueur * 0.12, reflet, clamp(F * 1.4, 0.0, 0.9));
        }
        gl_FragColor = vec4(c, 1.0);`,
      );
  };
  const liquide = new Mesh(liquideGeo, liquideMat);
  liquide.position.y = -H / 2 + fondEpais + hInterieur / 2;
  flacon.add(liquide);
  const niveauRepos = -H / 2 + fondEpais + hInterieur * 0.8; // rempli aux 4/5, repère du flacon
  uniformsLiquide.uBas.value = -H / 2 + fondEpais;

  // Col en verre
  const col = new Mesh(new RoundedBoxGeometry(0.36, 0.2, 0.3, 4, 0.04), verre);
  col.position.y = H / 2 + 0.09;
  flacon.add(col);

  // Bouchon doré : métal poli, une bague plus sombre à la base
  const or = new MeshPhysicalMaterial({ color: '#e8bd74', metalness: 1, roughness: 0.34, clearcoat: 0.6, clearcoatRoughness: 0.1, envMapIntensity: 1.6 });
  const bouchon = new Mesh(new RoundedBoxGeometry(0.61, 0.5, 0.46, 5, 0.05), or);
  bouchon.position.y = H / 2 + 0.2 + 0.25;
  flacon.add(bouchon);
  const bague = new Mesh(
    new RoundedBoxGeometry(0.64, 0.05, 0.49, 3, 0.02),
    new MeshPhysicalMaterial({ color: '#9c7238', metalness: 1, roughness: 0.3, envMapIntensity: 1.2 }),
  );
  bague.position.y = H / 2 + 0.2 + 0.025;
  flacon.add(bague);

  // Étiquette « MA » sur la face avant
  const etiquette = new Mesh(
    new PlaneGeometry(0.86, 0.43),
    new MeshBasicMaterial({ map: texteEtiquette(), transparent: true, depthWrite: false, toneMapped: false }),
  );
  etiquette.position.set(0, -0.12, P / 2 + 0.004);
  flacon.add(etiquette);

  // Ombre de contact (reste au sol pendant que le flacon flotte)
  const ombre = new Mesh(
    new PlaneGeometry(3, 1.5),
    new MeshBasicMaterial({ map: texteOmbre(), transparent: true, depthWrite: false }),
  );
  ombre.rotation.x = -Math.PI / 2;
  ombre.position.y = -H / 2 - 0.12;
  scene.add(ombre);

  // Légère inclinaison de trois-quarts au départ
  let angle = -0.5;

  // ---------- Rotation : auto + glisser horizontal avec inertie ----------
  let vitesseInertie = 0;
  let poidsAuto = calme ? 0 : 1;
  let relacheA = -Infinity;
  let glisse = false;
  let dernierX = 0;
  let dernierT = 0;
  const horloge = new Clock();

  canvas.style.touchAction = 'pan-y'; // le défilement vertical de la page reste libre sur mobile
  canvas.addEventListener('pointerdown', (e) => {
    glisse = true;
    dernierX = e.clientX;
    dernierT = performance.now();
    vitesseInertie = 0;
    poidsAuto = 0;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('saisi');
    demarrer();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!glisse) return;
    const maintenant = performance.now();
    const dx = e.clientX - dernierX;
    const dt = Math.max((maintenant - dernierT) / 1000, 1 / 240);
    const delta = dx * 0.01;
    angle += delta;
    vitesseInertie = vitesseInertie * 0.6 + (delta / dt) * 0.4;
    dernierX = e.clientX;
    dernierT = maintenant;
  });
  const relacher = () => {
    if (!glisse) return;
    glisse = false;
    relacheA = horloge.getElapsedTime();
    vitesseInertie = Math.max(-9, Math.min(9, vitesseInertie));
    canvas.classList.remove('saisi');
  };
  canvas.addEventListener('pointerup', relacher);
  canvas.addEventListener('pointercancel', relacher); // le navigateur reprend la main (défilement)

  // ---------- Taille et position du fond ----------
  function redimensionner() {
    const r = conteneur.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    const recul = camera.aspect < 0.85 ? 0.85 / camera.aspect : 1; // cadre étroit : on recule
    camera.position.copy(posCamera).multiplyScalar(recul);
    camera.lookAt(0, 0.25, 0);
    camera.updateProjectionMatrix();
    const f = fond.getBoundingClientRect();
    const u = materiauDuFond.uniforms;
    u.uDecalage.value.set(r.left - f.left, r.top - f.top);
    u.uTailleFond.value.set(f.width, f.height);
    u.uCentreHalo.value.set(r.left - f.left + r.width / 2, r.top - f.top + r.height / 2);
    u.uHauteurTampon.value = canvas.height;
    u.uRatio.value = renderer.getPixelRatio();
  }
  const ro = new ResizeObserver(redimensionner);
  ro.observe(conteneur);
  ro.observe(fond);
  redimensionner();

  // ---------- Physique du liquide (ressort amorti) ----------
  const pente = new Vector2();
  const vitessePente = new Vector2();
  let vague = 0;
  let omegaAvant = 0;
  let flotteAvant = 0;
  let vitesseFlotteAvant = 0;
  const RAIDEUR = 30; // balancement d'un peu moins d'un aller-retour par seconde
  const AMORTI = 0.9; // plusieurs allers-retours avant de se calmer, comme un vrai liquide

  // ---------- Boucle ----------
  const lisse = (x: number) => x * x * (3 - 2 * x);
  function image() {
    const dt = Math.min(horloge.getDelta(), 1 / 30);
    const t = horloge.getElapsedTime();

    // Rotation
    const angleAvant = angle;
    if (!glisse) {
      vitesseInertie *= Math.exp(-dt * 2.2);
      if (!calme) {
        const attente = t - relacheA - 2; // la rotation auto reprend 2 s après le relâchement
        poidsAuto = attente <= 0 ? 0 : lisse(Math.min(attente / 1.5, 1));
      }
      angle += (TOUR * poidsAuto + vitesseInertie) * dt;
    }
    flacon.rotation.y = angle;

    // Flottement
    const flotte = calme ? 0 : Math.sin(t * 0.9) * 0.06;
    flacon.position.y = flotte;
    ombre.scale.setScalar(1 - flotte * 0.8);
    (ombre.material as MeshBasicMaterial).opacity = 1 - flotte * 2;

    // Liquide : les accélérations (rotation, flottement) « poussent » la surface
    if (dt > 0) {
      const omega = (angle - angleAvant) / dt;
      const accel = (omega - omegaAvant) / dt;
      omegaAvant = omega;
      const vitesseFlotte = (flotte - flotteAvant) / dt;
      const accelFlotte = (vitesseFlotte - vitesseFlotteAvant) / dt;
      flotteAvant = flotte;
      vitesseFlotteAvant = vitesseFlotte;

      // (accélération limitée pour que même un geste très brusque reste élégant)
      const a = Math.max(-260, Math.min(260, accel));
      const pousseX = -a * 0.03;
      const pousseZ = a * 0.01;
      vitessePente.x += (-RAIDEUR * pente.x - AMORTI * vitessePente.x + pousseX) * dt;
      vitessePente.y += (-RAIDEUR * pente.y - AMORTI * vitessePente.y + pousseZ) * dt;
      pente.addScaledVector(vitessePente, dt);
      pente.clampScalar(-0.32, 0.32);

      // Vaguelettes : nourries par le mouvement de la surface, puis s'éteignent
      vague += (vitessePente.length() * 0.02 + Math.abs(accelFlotte) * 0.002 - vague * 1.8) * dt;
      vague = Math.min(Math.max(vague, calme ? 0 : 0.0035), 0.04); // au repos : un léger frémissement
    }
    const u = uniformsLiquide;
    u.uCentre.value.set(0, flotte, 0);
    u.uNiveau.value = niveauRepos;
    u.uPente.value.copy(pente);
    u.uVague.value = vague;
    u.uTemps.value = t;

    renderer.render(scene, camera);
  }

  // ---------- Pause hors écran / onglet caché ----------
  let visible = true;
  let tourne = false;
  function demarrer() {
    if (tourne || !visible || document.hidden) return;
    tourne = true;
    horloge.getDelta();
    renderer.setAnimationLoop(image);
  }
  function arreter() {
    tourne = false;
    renderer.setAnimationLoop(null);
  }
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    visible ? demarrer() : arreter();
  }).observe(conteneur);
  document.addEventListener('visibilitychange', () => (document.hidden ? arreter() : demarrer()));

  image();
  demarrer();
  return canvas;
}
