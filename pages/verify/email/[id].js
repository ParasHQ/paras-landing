import Axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import near from '../../../lib/near'

const EmailVerification = () => {
	const [emailVerified, setEmailVerified] = useState(false)
	const [resMsg, setResMsg] = useState('')
	const router = useRouter()

	useEffect(() => {
		verifyEmail()
	})

	const verifyEmail = async () => {
		console.log('auth token', await near.authToken())
		try {
			const test = await Axios.put(
				`${process.env.API_URL}/credentials/mail/verify`,
				{
					token: router.query.id,
				},
				{
					headers: {
						authorization: await near.authToken(),
					},
				}
			)
			setResMsg(test.data.message)
			console.log(test)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div>
			<div>Email verification</div>
			<div>verified? {emailVerified ? 'yes' : 'no'}</div>
			<div>{resMsg}</div>
		</div>
	)
}

export default EmailVerification
