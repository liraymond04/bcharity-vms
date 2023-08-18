import checkAuth from './checkAuth'
import createCollect from './createCollect'
import createProfile from './createProfile'
import getAvatar from './getAvatar'
import getProfile from './getProfile'
import getProfilesOwnedBy from './getProfilesOwnedBy'
import getSignature from './getSignature'
import lensClient from './lensClient'
import { UseApplicationsParams, UseApplicationsReturn } from './useApplications'
import useBookmark, {
  UseBookmarkParams,
  UseBookmarkReturn
} from './useBookmark'
import useCausesDonatedTo, {
  UseCausesDonatedToParams,
  UseCausesDonatedToReturn
} from './useCausesDonatedTo'
import useCreateComment, {
  CreateCommentParams,
  CreateCommentReturn
} from './useCreateComment'
import useCreatePost, {
  CreatePostParams,
  CreatePostReturn
} from './useCreatePost'
import useEnabledCurrencies from './useEnabledCurrencies'
import useExplorePublications from './useExplorePublications'
import useFollow, { UseFollowParams, UseFollowReturn } from './useFollow'
import useLogHours, {
  UseLogHoursParams,
  UseLogHoursReturn
} from './useLogHours'
import usePostData from './usePostData'
import usePublication, {
  UsePublicationParams,
  UsePublicationReturn
} from './usePublication'
import useRegisteredOpportunities, {
  UseRegisteredOpportunitiesParams,
  useRegisteredOpportunitiesReturn
} from './useRegisteredOpportunities'
import useVHRRequests from './useVHRRequests'
import { useVolunteers } from './useVolunteers'
import isValidHandle from './util/isValidHandle'

export {
  checkAuth,
  createCollect,
  createProfile,
  getAvatar,
  getProfile,
  getProfilesOwnedBy,
  getSignature,
  isValidHandle,
  lensClient,
  useBookmark,
  useCausesDonatedTo,
  useCreateComment,
  useCreatePost,
  useEnabledCurrencies,
  useExplorePublications,
  useFollow,
  useLogHours,
  usePostData,
  usePublication,
  useRegisteredOpportunities,
  useVHRRequests,
  useVolunteers
}

export type {
  CreateCommentParams,
  CreateCommentReturn,
  CreatePostParams,
  CreatePostReturn,
  UseApplicationsParams,
  UseApplicationsReturn,
  UseBookmarkParams,
  UseBookmarkReturn,
  UseCausesDonatedToParams,
  UseCausesDonatedToReturn,
  UseFollowParams,
  UseFollowReturn,
  UseLogHoursParams,
  UseLogHoursReturn,
  UsePublicationParams,
  UsePublicationReturn,
  UseRegisteredOpportunitiesParams,
  useRegisteredOpportunitiesReturn
}
