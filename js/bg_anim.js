document.addEventListener("DOMContentLoaded", call_anim, false);
function call_anim() {
  let cc_anim = document.getElementById("cc_stand");
  if (cc_anim != undefined) {
    function animBg(container) {
      var size = { w: container.clientWidth, h: container.clientHeight };
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        size.w / size.h,
        0.1,
        1000
      );

      const webGLRenderer = new THREE.WebGLRenderer({ antialias: true });
      webGLRenderer.setSize(size.w, size.h);
      webGLRenderer.shadowMapEnabled = true;

      camera.position.x = -30;
      camera.position.y = 40;
      camera.position.z = 50;
      camera.lookAt(new THREE.Vector3(10, 0, 0));
      container.append(webGLRenderer.domElement);

      var step = 0;
      var knot;

      // setup the control
      var controls = new (function () {
        // we need the first child, since it's a multimaterial
        this.radius = 40;
        this.tube = 28.2;
        this.radialSegments = 600;
        this.tubularSegments = 12;
        this.p = 5;
        this.q = 4;
        this.heightScale = 4;
        this.asParticles = true;
        this.rotate = true;

        this.redraw = function () {
          // remove the old plane
          if (knot) scene.remove(knot);
          // create a new one
          var geom = new THREE.TorusKnotGeometry(
            controls.radius,
            controls.tube,
            Math.round(controls.radialSegments),
            Math.round(controls.tubularSegments),
            Math.round(controls.p),
            Math.round(controls.q),
            controls.heightScale
          );

          if (controls.asParticles) {
            knot = createParticleSystem(geom);
          } else {
            knot = createMesh(geom);
          }

          // add it to the scene.
          scene.add(knot);
        };
      })();
      controls.redraw();

      render();

      // from THREE.js examples
      function generateSprite() {
        var canvas = document.createElement("canvas");
        canvas.width = 16;
        canvas.height = 16;

        var context = canvas.getContext("2d");
        var gradient = context.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2
        );
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        // gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        // gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, "rgba(0,0,0,1)");

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
      }

      function createParticleSystem(geom) {
        var material = new THREE.ParticleBasicMaterial({
          color: 0xffffff,
          size: 2,
          transparent: true,
          blending: THREE.AdditiveBlending,
          map: generateSprite(),
        });

        var system = new THREE.ParticleSystem(geom, material);
        system.sortParticles = true;
        return system;
      }

      function createMesh(geom) {
        // assign two materials
        var meshMaterial = new THREE.MeshNormalMaterial({});
        meshMaterial.side = THREE.DoubleSide;

        // create a multimaterial
        var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [
          meshMaterial,
        ]);

        return mesh;
      }

      ScrollTrigger.refresh();
      let tl = gsap.timeline();
      tl.to(knot.rotation, {
        x: -5,
        y: 5,
        z: 5,
      }).pause();
      ScrollTrigger.create({
        trigger: container,
        pin: true,
        start: "top top",
        scrub: 1.2,
        animation: tl,
        end: "+=500%",
      });

      function render() {
        if (controls.rotate) {
          knot.rotation.x = Math.cos((step += 0.0008));
          knot.rotation.z = Math.sin((step += 0.001));
        }
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
      }

      window.addEventListener("resize", onWindowResize, false);
      function onWindowResize() {
        size = {
          w: container.clientWidth,
          h: container.clientHeight,
        };
        camera.aspect = size.w / size.h;
        camera.updateProjectionMatrix();
        webGLRenderer.setSize(size.w, size.h);
      }
    }
    setTimeout(() => {
      animBg(cc_anim);
    }, 2500);
  }
}
