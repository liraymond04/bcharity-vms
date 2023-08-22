import 'tippy.js/dist/tippy.css'

import { InformationCircleIcon } from '@heroicons/react/outline'
import Tippy from '@tippyjs/react'
import React, { FC, ReactNode } from 'react'

/**
 * Properties of {@link HelpTooltip}
 */
export interface HelpTooltipProps {
  /**
   * Content to display in help tool tip
   */
  content: ReactNode
}

/**
 * Component that displays a help tool tip
 */
const HelpTooltip: FC<HelpTooltipProps> = ({ content }) => {
  if (!content) return null

  return (
    <Tippy
      placement="top"
      duration={0}
      className="p-2.5 tracking-wide !rounded-xl !leading-5 shadow-lg"
      content={<span>{content}</span>}
    >
      <InformationCircleIcon className="text-gray-500 h-[15px] w-[15px]" />
    </Tippy>
  )
}

export default HelpTooltip
