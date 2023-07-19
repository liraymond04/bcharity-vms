const Progress = ({
  progress,
  total,
  className
}: {
  progress: number
  total: number
  className?: string
}) => (
  <div className={className}>
    <div className="w-full bg-gray-200 rounded-full h-5 ">
      <div
        className="bg-green-400 h-5 rounded-full"
        style={{
          width: `${Math.min(Math.trunc((progress / total) * 100), 100)}%`
        }}
      ></div>
    </div>
  </div>
)

export default Progress
