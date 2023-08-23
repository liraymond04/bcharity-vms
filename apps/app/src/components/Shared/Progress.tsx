import { FC } from 'react'

/**
 * Properties of {@link Progress}
 */
export interface ProgressProps {
  /**
   * Value with the current progress
   */
  progress: number
  /**
   * Value of the total progress
   */
  total: number
  /**
   * Class names and tailwind styles passed to the component
   */
  className?: string
}

/**
 * A component that displays a progress bar
 *
 * The percentage of the progress bar filled is automatically
 * calculated given the progress and total properties
 *
 * @example Progress used in {@link components.Dashboard.OrganizationDashboard.OrganizationVHR}
 * ```tsx
 * {vhrGoal !== 0 && (
 *   <Progress
 *     progress={Number(balanceData?.value)}
 *     total={vhrGoal}
 *     className="mt-10 mb-10"
 *   />
 * )}
 * ```
 */
const Progress: FC<ProgressProps> = ({ progress, total, className }) => (
  <div className={className}>
    <div className="w-full bg-gray-200 rounded-full h-5 ">
      <div
        className="bg-green-400 dark:bg-[#54787e] h-5 rounded-full"
        style={{
          width: `${Math.min(Math.trunc((progress / total) * 100), 100)}%`
        }}
      ></div>
    </div>
  </div>
)

export default Progress
