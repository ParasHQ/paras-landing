import LinkToProfile from 'components/Common/LinkToProfile'
import { HISTORY_DATA } from 'constants/dummy'
import { prettyBalance } from 'utils/common'
import { formatTimeAgo } from 'utils/dateHelper'

const TabHistory = () => {
  return (
    <div className="mt-4 text-white">
      {HISTORY_DATA.results.map((history) => (
        <Activity key={history._id} activity={history} />
      ))}
    </div>
  )
}

const Activity = ({ activity }) => {
  const TextActivity = ({ type }) => {
    if (type === 'marketUpdate') {
      return (
        <p>
          <LinkToProfile accountId={activity.from} />
          <span>
            {' '}
            put on sale for {prettyBalance(activity.amount, 24, 4)} Ⓝ
          </span>
        </p>
      )
    }

    if (type === 'marketDelete') {
      return (
        <p>
          <LinkToProfile accountId={activity.from} />
          <span> remove from sale</span>
        </p>
      )
    }

    if (type === 'marketBuy') {
      return (
        <p>
          <LinkToProfile accountId={activity.from} />
          <span> bought {activity.quantity}pcs from </span>
          <LinkToProfile accountId={activity.to} />
          <span> for </span>
          {prettyBalance(activity.amount, 24, 4)} Ⓝ
        </p>
      )
    }

    if (type === 'transfer' && activity.from === '') {
      return (
        <p>
          <LinkToProfile accountId={activity.to} />
          <span> create with supply of {activity.quantity}pcs</span>
        </p>
      )
    }

    if (type === 'transfer' && activity.to === '') {
      return (
        <p>
          <LinkToProfile accountId={activity.from} />
          <span> burned {activity.quantity}pcs</span>
        </p>
      )
    }

    if (type === 'transfer' && !activity.to) {
      return null
    }

    if (type === 'bidMarketAdd') {
      return (
        <p>
          <LinkToProfile accountId={activity.accountId} />
          <span> placed offer for </span>
          <span>{prettyBalance(activity.amount, 24, 4)} Ⓝ</span>
        </p>
      )
    }

    return (
      <p>
        <LinkToProfile accountId={activity.from} />
        <span> transfer {activity.quantity}pcs to </span>
        <LinkToProfile accountId={activity.to} />
      </p>
    )
  }

  return (
    <div className="bg-blueGray-900 border border-blueGray-700 mt-3 p-3 rounded-md shadow-md">
      {TextActivity(activity.type)}
      <p className="mt-1 text-sm">{formatTimeAgo(activity.createdAt)}</p>
    </div>
  )
}

export default TabHistory
