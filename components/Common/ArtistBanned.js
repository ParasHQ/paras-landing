import { useIntl } from 'hooks/useIntl'
import { flagColor, flagText } from 'constants/flag'
import useProfileData from 'hooks/useProfileData'

const ArtistBanned = ({ creatorId, className }) => {
	const { localeLn } = useIntl()
	const artistData = useProfileData(creatorId)

	return (
		<>
			{artistData?.flag && (
				<div
					className={`${className} absolute z-20 bottom-0 flex items-center justify-center px-4 md:px-12 w-full`}
				>
					<p
						className={`text-white text-sm m-2 md:mb-4 mt-2 p-1 font-bold w-full mx-auto px-4 text-center rounded-md ${
							flagColor[artistData?.flag]
						}`}
					>
						{localeLn(flagText[artistData?.flag])}
					</p>
				</div>
			)}
		</>
	)
}

export default ArtistBanned
