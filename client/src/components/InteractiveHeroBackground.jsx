import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const FloatingEventItem = ({ position, color, speed, offset, type }) => {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  const [clicked, setClick] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ref.current) {
      const baseSpeed = hovered ? speed * 3 : speed;

      // Confetti spins wildly, balloons just gently sway, firecrackers spin
      if (type === "confetti") {
        ref.current.rotation.x = time * baseSpeed * 2 + offset;
        ref.current.rotation.y = time * baseSpeed * 3 + offset;
        ref.current.rotation.z = time * baseSpeed * 2 + offset;
      } else if (type === "balloon") {
        ref.current.rotation.x = Math.sin(time * speed + offset) * 0.2; // Gentle sway
        ref.current.rotation.y = Math.cos(time * speed + offset) * 0.5;
      } else {
        ref.current.rotation.x = Math.sin(time * baseSpeed + offset) * Math.PI;
        ref.current.rotation.y = Math.cos(time * baseSpeed + offset) * Math.PI;
      }

      // Interactive floating based on mouse
      ref.current.position.x +=
        (position[0] + state.pointer.x * 0.5 - ref.current.position.x) * 0.02;
      ref.current.position.y +=
        (position[1] + state.pointer.y * 0.35 - ref.current.position.y) * 0.02;

      // Scale animation for hover/click
      const targetScale = clicked ? 1.5 : hovered ? 1.2 : 1;
      ref.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1,
      );
    }
  });

  return (
    <Float
      speed={speed}
      rotationIntensity={type === "balloon" ? 0.5 : 2}
      floatIntensity={type === "balloon" ? 4 : 2}
    >
      <group
        ref={ref}
        position={position}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHover(false);
          setClick(false);
          document.body.style.cursor = "auto";
        }}
        onClick={() => setClick(!clicked)}
      >
        {/* We apply material logic differently because we are rendering groups with children now. 
            For simplicity, we'll clone the element and apply material directly or use a parent with inherited color if possible. 
            Actually, we can inject material directly into children, but easier to just use standard material on the group if it's simple,
            or map the color to the mesh. We will wrap the item in a mesh that doesn't render, or just apply it inside the components.
            Wait, React Three Fiber applies material to the mesh. 
            Since our custom components return groups with meshes inside, we need to pass the color down. */}

        {type === "balloon" && (
          <group>
            <mesh position={[0, 0.2, 0]} scale={[1, 1.2, 1]}>
              <sphereGeometry args={[0.4, 32, 32]} />
              <meshPhysicalMaterial
                color={hovered ? "#ffffff" : color}
                emissive={hovered ? color : "#000000"}
                emissiveIntensity={hovered ? 0.5 : 0}
                roughness={0.2}
                clearcoat={1}
              />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <coneGeometry args={[0.08, 0.15, 8]} />
              <meshPhysicalMaterial
                color={hovered ? "#ffffff" : color}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, -0.8, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 1, 4]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
            </mesh>
          </group>
        )}

        {type === "firecracker" && (
          <group>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
              <meshStandardMaterial
                color={hovered ? "#ffffff" : "#ef4444"}
                emissive={hovered ? "#ef4444" : "#000000"}
                emissiveIntensity={hovered ? 0.5 : 0}
              />
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <coneGeometry args={[0.15, 0.2, 16]} />
              <meshStandardMaterial color="#fcd34d" />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.3, 4]} />
              <meshStandardMaterial color="#9ca3af" />
            </mesh>
          </group>
        )}

        {type === "confetti" && (
          <mesh>
            <planeGeometry args={[0.15, 0.3]} />
            <meshStandardMaterial
              color={color}
              side={THREE.DoubleSide}
              emissive={hovered ? color : "#000000"}
              emissiveIntensity={hovered ? 0.8 : 0}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
};

const MouseInteractiveCamera = () => {
  useFrame((state) => {
    state.camera.position.x +=
      (state.pointer.x * 0.8 - state.camera.position.x) * 0.04;
    state.camera.position.y +=
      (state.pointer.y * 0.55 - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const FireworkBurst = ({ position, color, delay = 0, seed, startOnMount = false }) => {
  const pointsRef = useRef();
  const rocketRef = useRef();
  const lightRef = useRef();
  const startTimeRef = useRef(null);
  const particles = useMemo(() => {
    let value = seed;
    const random = () => {
      value = (value * 16807) % 2147483647;
      return (value - 1) / 2147483646;
    };

    return Array.from({ length: 240 }, () => {
      const angle = random() * Math.PI * 2;
      const vertical = random() * 2 - 1;
      const planar = Math.sqrt(1 - vertical * vertical);
      const length = 0.65 + random() * 0.55;
      return new THREE.Vector3(
        Math.cos(angle) * planar * length,
        vertical * length,
        Math.sin(angle) * planar * length,
      );
    });
  }, [seed]);

  const geometry = useMemo(() => {
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particles.length * 3), 3));
    buffer.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 12);
    return buffer;
  }, [particles]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    if (startOnMount && startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime;
    }
    const cycle = 4.6;
    const age = startOnMount
      ? state.clock.elapsedTime - startTimeRef.current
      : (state.clock.elapsedTime + delay) % cycle;
    const burstStart = 0.65;
    const burstDuration = startOnMount ? 2.6 : 3.8;
    const progress = THREE.MathUtils.clamp((age - burstStart) / burstDuration, 0, 1);
    const isBursting = age >= burstStart && age <= burstStart + burstDuration;
    const isLaunching = age < burstStart;
    const launchProgress = THREE.MathUtils.clamp(age / burstStart, 0, 1);
    const positions = pointsRef.current.geometry.attributes.position.array;

    particles.forEach((direction, index) => {
      const distance = progress * 11;
      const gravity = progress * progress * 2.8;
      positions[index * 3] = direction.x * distance;
      positions[index * 3 + 1] = direction.y * distance - gravity;
      positions[index * 3 + 2] = direction.z * distance;
    });

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.visible = isBursting;
    pointsRef.current.material.opacity = isBursting ? (1 - progress * 0.65) : 0;
    pointsRef.current.material.size = 0.14 + progress * 0.08;
    if (rocketRef.current) {
      rocketRef.current.visible = isLaunching;
      rocketRef.current.position.y = -3 + launchProgress * 3;
      rocketRef.current.scale.setScalar(0.8 + launchProgress * 0.35);
    }
    if (lightRef.current) lightRef.current.intensity = isBursting ? (1 - progress) * 4 : isLaunching ? 2.5 : 0;
  });

  return (
    <group position={position}>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial color={color} size={0.14} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation toneMapped={false} />
      </points>
      <group ref={rocketRef} position={[0, -3, 0]}>
        <mesh>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.27, 0]}>
          <cylinderGeometry args={[0.018, 0.035, 0.48, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} toneMapped={false} />
        </mesh>
      </group>
      <pointLight ref={lightRef} color={color} intensity={0} distance={9} decay={2} />
    </group>
  );
};

const InteractiveHeroBackground = () => {
  const [clickBurst, setClickBurst] = useState(null);
  const burstId = useRef(0);
  const items = useMemo(() => {
    const colors = [
      "#f472b6",
      "#a78bfa",
      "#60a5fa",
      "#fbbf24",
      "#34d399",
      "#f87171",
    ];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      position: [Math.cos((i / 18) * Math.PI * 2) * 10, Math.sin((i / 18) * Math.PI * 2) * 5.5, -3],
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.5 + Math.random() * 1.5,
      offset: Math.random() * 100,
      type: "confetti",
    }));
  }, []);

  const launchFireworkAtPointer = (event) => {
    const bounds = event.target.getBoundingClientRect();
    const normalizedX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const normalizedY = 1 - ((event.clientY - bounds.top) / bounds.height) * 2;
    const halfViewHeight = Math.tan(THREE.MathUtils.degToRad(60 / 2)) * 10;
    const halfViewWidth = halfViewHeight * (bounds.width / bounds.height);
    setClickBurst({
      id: ++burstId.current,
      position: [normalizedX * halfViewWidth * 0.8, normalizedY * halfViewHeight * 0.8, -1],
    });
  };

  return (
    <div className="absolute inset-0 z-0 cursor-crosshair">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} onPointerMissed={launchFireworkAtPointer}>
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          color="#ffffff"
        />
        <pointLight position={[-10, -10, -5]} intensity={2} color="#f472b6" />
        <pointLight position={[0, 10, -5]} intensity={1.5} color="#a78bfa" />
        <pointLight position={[10, -10, 5]} intensity={1.5} color="#fbbf24" />

        <Sparkles
          count={500}
          scale={25}
          size={3}
          speed={0.6}
          opacity={0.6}
          color="#ffffff"
        />

        {items.map((item) => (
          <FloatingEventItem key={item.id} {...item} />
        ))}

        <FireworkBurst position={[-7, 1.5, -2]} color="#ff5cad" delay={0.3} seed={17} />
        <FireworkBurst position={[7, 1.5, -3]} color="#55c7ff" delay={1.4} seed={29} />
        <FireworkBurst position={[-3, 3.5, -5]} color="#ffd166" delay={2.5} seed={41} />
        <FireworkBurst position={[3, -2.8, -4]} color="#b98aff" delay={3.6} seed={53} />
        {clickBurst && (
          <FireworkBurst
            key={clickBurst.id}
            position={clickBurst.position}
            color={['#ff5cad', '#55c7ff', '#ffd166', '#b98aff'][clickBurst.id % 4]}
            seed={clickBurst.id * 61 + 7}
            startOnMount
          />
        )}

        <MouseInteractiveCamera />
      </Canvas>
    </div>
  );
};

export default InteractiveHeroBackground;
