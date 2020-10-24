import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'

const adapter = new FileSync(path.join(process.cwd(), 'db.json'))
const db = low(adapter)

db.defaults({ users: [] }).write()

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const users = db.get('users')
		const userExist = users.find({ email: req.body.email }).value()

		if (!userExist) {
			users
				.push({
					email: req.body.email,
					createdAt: new Date().toISOString(),
				})
				.write()

			return res.json({
				success: 1,
				message: 'successfully registered',
			})
		} else {
			return res.json({
				success: 0,
				message: 'email already registered',
			})
		}
	}
}
