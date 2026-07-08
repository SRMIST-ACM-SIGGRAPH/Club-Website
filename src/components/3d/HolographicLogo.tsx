'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface HolographicLogoProps {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
}

export function HolographicLogo({ mouseX, mouseY }: HolographicLogoProps) {
  const groupRef = useRef<THREE.Group>(null);
  const acmGlitchRef = useRef<THREE.Group>(null);
  
  const sigWireMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const sigCoreMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const initialized = useRef(false);

  // Build-in animation on mount
  useEffect(() => {
    if (initialized.current || !groupRef.current) return;
    initialized.current = true;

    const group = groupRef.current;

    // Start invisible/small
    group.scale.setScalar(0);
    group.position.z = -3;

    // Animate in: scale up + move to 0
    gsap.to(group.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.8,
      ease: 'expo.out',
      delay: 1.8,
    });
    gsap.to(group.position, {
      z: 0,
      duration: 1.8,
      ease: 'expo.out',
      delay: 1.8,
    });
  }, []);

  // Animations & Parallax
  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;

    // Gentle bob for the whole logo
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.12;

    // Mouse parallax
    const targetY = Math.sin(t * 0.25) * 0.06 + (mouseX.current * 0.8);
    const targetX = -mouseY.current * 0.8;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.1;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.1;

    // Independent cool rotation for ACM (Disabled as requested)

    // Chromatic Aberration Glitch for ACM
    if (acmGlitchRef.current) {
      if (Math.random() > 0.92) {
        // Active glitch
        acmGlitchRef.current.position.x = (Math.random() - 0.5) * 0.15;
        acmGlitchRef.current.position.y = (Math.random() - 0.5) * 0.15;
        acmGlitchRef.current.position.z = (Math.random() - 0.5) * 0.1 - 0.05;
      } else {
        // Return to normal subtle offset
        acmGlitchRef.current.position.lerp(new THREE.Vector3(0.02, 0.02, -0.05), 0.1);
      }
    }

    // Flickering effect for SIGGRAPH
    if (sigWireMatRef.current && sigCoreMatRef.current) {
      if (Math.random() > 0.96) {
        // Brief bright flicker
        sigWireMatRef.current.opacity = 1.0;
        sigCoreMatRef.current.opacity = 0.8;
      } else {
        // Normal dimmer state
        sigWireMatRef.current.opacity = 0.6;
        sigCoreMatRef.current.opacity = 0.15;
      }
    }
  });

  const accentOrange = '#FF6B1A';
  const accentGold = '#FFB347';
  const accentCyan = '#00ffcc'; // Tech cyan for chromatic glitch
  const sigColor = new THREE.Color(accentGold).multiplyScalar(1.8);

  // Common font settings for low-poly holographic wireframe look
  const fontProps = {
    font: "/fonts/droid_sans_mono_regular.typeface.json",
    size: 0.75, // Standard size
    height: 0.15,
    curveSegments: 3, // Low segments makes the wireframe look cleaner and more "tech"
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 2,
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ACM */}
      <Center position={[0, 0.7, 0]}>
        <group>
          {/* Inner faint glowing core */}
          <Text3D {...fontProps} size={0.5}>
            {'ACM'}
            <meshBasicMaterial color={accentOrange} transparent opacity={0.25} />
          </Text3D>
          
          {/* Main Orange Wireframe */}
          <Text3D {...fontProps} size={0.5}>
            {'ACM'}
            <meshBasicMaterial color={accentOrange} wireframe transparent opacity={0.9} />
          </Text3D>

          {/* Cyan Glitch Offset Layer (Chromatic Aberration) */}
          <group ref={acmGlitchRef}>
            <Text3D {...fontProps} size={0.5}>
              {'ACM'}
              <meshBasicMaterial color={accentCyan} wireframe transparent opacity={0.5} />
            </Text3D>
          </group>
        </group>
      </Center>

      {/* SIGGRAPH */}
      <Center position={[0, -0.4, 0]}>
        <group>
          {/* Inner faint glowing core */}
          <Text3D {...fontProps}>
            {'SIGGRAPH'}
            <meshBasicMaterial ref={sigCoreMatRef} color={sigColor} transparent opacity={0.4} />
          </Text3D>
          {/* Outer wireframe shell */}
          <Text3D {...fontProps}>
            {'SIGGRAPH'}
            <meshBasicMaterial ref={sigWireMatRef} color={sigColor} wireframe transparent opacity={1.0} />
          </Text3D>
        </group>
      </Center>

      {/* Point lights to add extra ambient bloom in the scene */}
      <pointLight color={accentOrange} intensity={1.5} distance={6} position={[0, 1.5, 2]} />
      <pointLight color={accentGold} intensity={1.5} distance={6} position={[0, -1, 2]} />
    </group>
  );
}
