import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
import { parseImgUrl } from 'utils/common'
import { useFrame } from '@react-three/fiber'

const Model1 = ({ threeDUrl }) => {
	const wrapRef = useRef()
	const loadedGltf = useGLTF(parseImgUrl(threeDUrl), true)
	useFrame(() => (wrapRef.current.rotation.y += 0.01))
	return (
		<mesh ref={wrapRef}>
			<primitive object={loadedGltf.scene} dispose={null} />
			<OrbitControls />
			<ambientLight />
		</mesh>
	)
}

export { Model1 }
