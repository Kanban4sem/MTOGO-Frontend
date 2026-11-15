import { useState } from 'react'

export default function FoodImage({ src, alt, ...props }) {
	const [failedSource, setFailedSource] = useState(null)
	const source =
		src === '/images/restaurant/menu/restaurant-1-item-1.jpg'
			? '/images/restaurant/menu/restaurant-1-item-1.png'
			: src
	const imageSource =
		source && failedSource !== source ? source : '/images/placeholder.png'

	return (
		<img
			{...props}
			src={imageSource}
			alt={alt}
			onError={() => setFailedSource(source)}
		/>
	)
}
