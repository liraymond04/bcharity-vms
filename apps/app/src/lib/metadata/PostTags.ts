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
   * Tag to use for publishing a goal
   */
  Goal = 'ORG_PUBLISH_Goal'
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
 * A group of tags related to VHR requests
 */
export enum VhrRequest {
  /**
   * Tags realted to making and verifying VHR requests for a volunteer opportunity
   */
  Opportunity = 'VHR_REQUEST_OPPORTUNITY',
  Reject = 'VHR_REJECT_REQUEST'
}

/**
 * An object that holds the post tags used by the application
 */
export const PostTags = {
  /**
   * Collection of tags for organizations publishing and modifying
   */
  OrgPublish,
  /**
   * Collection of tags for bookmarking publications
   */
  Bookmark,
  /**
   * Collection of tags for making VHR requests
   */
  VhrRequest
}
