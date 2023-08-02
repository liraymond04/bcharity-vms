import { Inter } from '@next/font/google'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'

const inter500 = Inter({
  subsets: ['latin'],
  weight: ['500']
})

const generateVolunteerData = () => {
  var data = []
  var last = 1e9
  for (let i = 0; i < 20; i++) {
    const op = {
      name: 'Volunteer ' + (i + 1),
      vhr: Math.floor(Math.random() * last)
    }
    last = op.vhr
    data.push(op)
  }
  return data
}

const generateOrganizationData = () => {
  var data = []
  var last = 1e9
  for (let i = 0; i < 20; i++) {
    const op = {
      name: 'Organization ' + (i + 1),
      vhr: Math.floor(Math.random() * last)
    }
    last = op.vhr
    data.push(op)
  }
  return data
}

const VHRs: NextPage = () => {
  const [volunteerData, setVolunteerData] = useState<any[]>()
  const [organizationData, setOrganizationData] = useState<any[]>()

  useEffect(() => {
    setVolunteerData(generateVolunteerData())
    setOrganizationData(generateOrganizationData())
  }, [])

  return (
    <div className={`${inter500.className}`}>
      <div className="flex justify-around items-center">
        <div className="text-3xl text-[#343434] mt-10 dark:text-[#E2E2E2]">
          Top VHR Holders
        </div>
      </div>
      <div className="flex justify-around mb-20 flex-wrap">
        <div className="min-w-[450px] mx-2 h-[550px] bg-[#F9F9F9] dark:bg-[#18004A] rounded-lg mt-10">
          <div className="text-2xl text-[#626262] dark:text-[#E2E2E2] my-5 mx-auto w-fit h-fit">
            Volunteers
          </div>
          <div className="overflow-y-scroll h-[470px]">
            {volunteerData &&
              volunteerData.map((value, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center w-[400px] h-[80px] mx-auto my-2 border-b-[1px] border-[#DDDDDD]"
                >
                  <div className="flex justify-between items-center">
                    <div className="ml-2 text-[#7E7E7E]">{index + 1}</div>
                    <div className="w-10 h-10 bg-[#EB7575] mx-4 rounded-full"></div>
                    <a href={`/user/${value.name}`}>
                      <div
                        className={`${
                          index == 0
                            ? 'text-[#FFD600]'
                            : index == 1
                            ? 'text-[#CCCCCC]'
                            : index == 2
                            ? 'text-[#8E5E00]'
                            : 'text-[#A3A3A3]'
                        }`}
                      >
                        {value.name}
                      </div>
                    </a>
                  </div>
                  <div className="text-[#A3A3A3] text-sm">{value.vhr} VHRs</div>
                </div>
              ))}
          </div>
        </div>
        <div className="min-w-[450px] mx-2 h-[550px] bg-[#F9F9F9] dark:bg-[#18004A] rounded-lg mt-10">
          <div className="text-2xl text-[#626262] dark:text-[#E2E2E2] my-5 mx-auto w-fit h-fit">
            Organizations
          </div>
          <div className="overflow-y-scroll h-[470px]">
            {organizationData &&
              organizationData.map((value, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center w-[400px] h-[80px] mx-auto my-2 border-b-[1px] border-[#DDDDDD]"
                >
                  <div className="flex justify-between items-center">
                    <div className="ml-2 text-[#7E7E7E]">{index + 1}</div>
                    <div className="w-10 h-10 bg-[#498ade] mx-4 rounded-full"></div>
                    <a href={`/user/${value.name}`}>
                      <div
                        className={`${
                          index == 0
                            ? 'text-[#FFD600]'
                            : index == 1
                            ? 'text-[#CCCCCC]'
                            : index == 2
                            ? 'text-[#8E5E00]'
                            : 'text-[#A3A3A3]'
                        } `}
                      >
                        {value.name}
                      </div>
                    </a>
                  </div>
                  <div className="text-[#A3A3A3] text-sm">{value.vhr} VHRs</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VHRs
