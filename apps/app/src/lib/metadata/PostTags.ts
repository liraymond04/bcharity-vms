/**
 * A group of tags related to organizations publishing
 */
export enum OrgPublish {
  /**
   * Tag to use for an organization publishing or modifying a volunteer opportunity
   */
  Opportunity = 'ORG_PUBLISH_OPPORTUNITY',
  /**
   * Tag to use for an organization publishing or modifying a cause
   */
  Cause = 'ORG_PUBLISH_CAUSE',
  /**
   * Tag to use for an organization publishing or modifying a volunteer opportunity draft
   */
  OpportunityDraft = 'ORG_PUBLISH_OPPORTUNITY_DRAFT',
  /**
   * Tag to use for an organization publishing or modifying a cause draft
   */
  CauseDraft = 'ORG_PUBLISH_CAUSE_DRAFT',
  /**
   * Tag to use for an organization setting a cause goal
   */
  Goal = 'ORG_PUBLISH_Goal',
  /**
   * Tag to use for an organization setting a vhr goal
   */
  VHRGoal = 'ORG_PUBLISH_VHRGoal'
}

/**
 * A group of tags related to bookmarking
 */
export enum Bookmark {
  /**
   * Tag to use for bookmarking a volunteer opportunity
   */
  Opportunity = 'BOOKMARK_OPPORTUNITY',
  /**
   * Tag to use for bookmarking a cause
   */
  Cause = 'BOOKMARK_CAUSE'
}

/**
 * A group of tags related to Applications
 */
export enum Application {
  /**
   * Tag to use for applying to an opportunity
   */
  Apply = 'VOLUNTEER_APPLY_OPPORTUNITY',
  /**
   * Tag to use for rejecting a request
   */
  REJECT = 'ORGANIZATION_REJECT_APPLICATION',
  /**
   * Tag to use for accepting a request
   */
  Accept = 'ORGANIZATION_ACCEPT_APPLICATION'
}

/**
 * A group of tags related to VHR requests
 */
export enum VhrRequest {
  /**
   * Tags related to making and verifying VHR requests for a volunteer opportunity
   */
  Opportunity = 'VHR_REQUEST_OPPORTUNITY',
  Reject = 'VHR_REJECT_REQUEST'
}

/**
 * Tags related to making donations
 */
export enum Donate {
  /**
   * Tag to use for setting a donation amount
   */
  SetAmount = 'DONATE_SET_AMOUNT'
}

/**
 * An object that holds the post tags used by the application
 */
export const PostTags = {
  OrgPublish,
  Bookmark,
  VhrRequest,
  Donate,
  Application
}
