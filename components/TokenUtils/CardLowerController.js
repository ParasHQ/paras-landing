import ButtonOutline from 'components/Common/ButtonOutline'
import IconLoveOutline from 'components/Icons/component/IconLoveOutline'
import IconFullscreen from 'components/Icons/component/IconFullscreen'
import IconView from 'components/Icons/component/IconView'
import { useIntl } from 'hooks/useIntl'

const CardLowerController = ({ localToken }) => {
	const { localeLn } = useIntl()

	return (
		<div className="flex flex-row justify-between items-center mt-4 mb-10">
			<div className="flex flex-row text-white items-center">
				<ButtonOutline
					content={
						<div className="flex flex-row items-center">
							<IconLoveOutline stroke={'#F9F9F9'} size={20} />
							<p className="ml-3">0 Like</p>
						</div>
					}
				/>
				<div className="mx-2">
					<IconView stroke={'#F9F9F9'} size={24} />
				</div>
				<p>{localToken.view || 0} </p>
				<p>{localeLn('Views')}</p>
			</div>

			<div className="justify-self-end">
				<ButtonOutline
					content={
						<div className="flex flex-row items-center">
							<IconFullscreen size={20} stroke={'#F9F9F9'} />
							<p className="ml-3">View art</p>
						</div>
					}
				/>
			</div>
		</div>
	)
}

export default CardLowerController
