import React from 'react'
import { useGLTF } from '@react-three/drei/core/useGLTF'
import { OrbitControls } from '@react-three/drei'
import { parseImgUrl } from 'utils/common'

const Model1 = ({ threeDUrl }) => {
	const loadedGltf = useGLTF(parseImgUrl(threeDUrl), true)

	return (
		<>
			<primitive object={loadedGltf.scene} dispose={null} />
			<OrbitControls />
			<ambientLight />
		</>
	)
}

export { Model1 }
