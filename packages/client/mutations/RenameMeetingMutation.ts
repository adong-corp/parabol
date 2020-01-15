import graphql from 'babel-plugin-relay/macro'
import {commitMutation} from 'react-relay'
import {StandardMutation} from '../types/relayMutations'
import {RenameMeetingMutation as TRenameMeetingMutation} from '../__generated__/RenameMeetingMutation.graphql'

graphql`
  fragment RenameMeetingMutation_meeting on RenameMeetingSuccess {
    meeting {
      name
    }
  }
`

const mutation = graphql`
  mutation RenameMeetingMutation($name: String!, $meetingId: ID!) {
    renameMeeting(name: $name, meetingId: $meetingId) {
      ... on ErrorPayload {
        error {
          message
        }
      }
      ...RenameMeetingMutation_meeting @relay(mask: false)
    }
  }
`

const RenameMeetingMutation: StandardMutation<TRenameMeetingMutation> = (
  atmosphere,
  variables,
  {onError, onCompleted}
) => {
  return commitMutation<TRenameMeetingMutation>(atmosphere, {
    mutation,
    variables,
    optimisticUpdater: (store) => {
      const {meetingId, name} = variables
      const meeting = store.get(meetingId)
      if (!meeting) return
      meeting.setValue(name, 'name')
    },
    onCompleted,
    onError
  })
}

export default RenameMeetingMutation
